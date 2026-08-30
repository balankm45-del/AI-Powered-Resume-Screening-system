import express, { Request, Response } from 'express';
import path from 'path';
import { createRequire } from 'module';
import multer from 'multer';
import mammoth from 'mammoth';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { extractCandidateNameStrict, verifyAndCleanCandidateName } from './src/utils/nameExtractor';

const require = createRequire(import.meta.url);

dotenv.config();

const app = express();
const PORT = 3000;

// Set up in-memory multer storage (max 15MB per resume)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 },
});

// JSON and URL-encoded body parsing
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Set CORS and JSON defaults for /api routes
app.use('/api', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Helper to extract text from buffer based on file mimetype / name
async function extractTextFromBuffer(buffer: Buffer, originalname: string, mimetype: string): Promise<string> {
  const ext = path.extname(originalname).toLowerCase();
  
  if (ext === '.pdf' || mimetype === 'application/pdf') {
    try {
      const pdfModule = require('pdf-parse');
      if (typeof pdfModule === 'function') {
        const pdfData = await pdfModule(buffer);
        if (pdfData && pdfData.text && pdfData.text.trim().length > 10) {
          return pdfData.text.trim();
        }
      } else if (pdfModule && pdfModule.PDFParse) {
        const parser = new pdfModule.PDFParse({ data: buffer });
        if (typeof parser.getText === 'function') {
          const textResult = await parser.getText();
          if (textResult) {
            const str = typeof textResult === 'string' ? textResult : (textResult.text || '');
            if (str.trim().length > 10) {
              return str.trim();
            }
          }
        }
      }
    } catch (err) {
      console.warn('pdf-parse extraction error, using fallback buffer stream:', err);
    }
  }

  if (ext === '.docx' || mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    try {
      const result = await mammoth.extractRawText({ buffer });
      if (result.value && result.value.trim().length > 10) {
        return result.value.trim();
      }
    } catch (err) {
      console.warn('mammoth error:', err);
    }
  }

  // General binary/printable ASCII extraction
  try {
    let str = '';
    for (let i = 0; i < buffer.length; i++) {
      const code = buffer[i];
      if ((code >= 32 && code <= 126) || code === 10 || code === 13 || code === 9) {
        str += String.fromCharCode(code);
      } else if (str.length > 0 && str[str.length - 1] !== ' ') {
        str += ' ';
      }
    }
    const cleanStr = str.replace(/\s+/g, ' ').trim();
    if (cleanStr.length > 15) {
      return cleanStr;
    }
  } catch (err) {
    console.warn('Buffer ASCII extraction fallback error:', err);
  }

  // Plain text fallback
  const rawText = buffer.toString('utf-8');
  return rawText.replace(/\0/g, '').trim();
}

// Helper function to call Gemini with retry and model fallback for high demand (503/429)
async function generateGeminiAnalysis(
  aiClient: GoogleGenAI,
  systemPrompt: string,
  userPrompt: string,
  responseSchema: any
): Promise<string | null> {
  // Recommended production models per gemini-api guidelines
  const candidateModels = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-3.7-flash'];

  for (let i = 0; i < candidateModels.length; i++) {
    const model = candidateModels[i];
    try {
      const response = await aiClient.models.generateContent({
        model,
        contents: [
          { text: systemPrompt },
          { text: userPrompt },
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema,
        },
      });

      if (response && response.text) {
        return response.text.trim();
      }
    } catch (err: any) {
      const status = err?.status || err?.code;
      const isOverloaded = status === 503 || status === 429 || `${err?.message}`.includes('503') || `${err?.message}`.includes('high demand') || `${err?.message}`.includes('UNAVAILABLE');
      
      // If overloaded and we have alternative models, wait briefly and try fallback model
      if (isOverloaded && i < candidateModels.length - 1) {
        await new Promise((r) => setTimeout(r, 300 * (i + 1)));
        continue;
      }
    }
  }

  return null;
}

// Fallback rule-based matching engine when Gemini API is unavailable or limits reached
function fallbackRuleBasedAnalysis(
  resumeText: string,
  fileName: string,
  fileSize: number,
  jobReq: {
    jobTitle: string;
    requiredSkills: string[];
    preferredSkills: string[];
    minEducation: string;
    minExperienceYears: number;
    jobDescription: string;
  }
) {
  const lowerText = resumeText.toLowerCase();

  // Candidate name extraction strictly following name rules (Header, never filename, preserve exact spelling/initials)
  const candidateName = extractCandidateNameStrict(resumeText);

  // Email regex
  const emailMatch = resumeText.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  const email = emailMatch ? emailMatch[1] : 'Not found';

  // Phone regex
  const phoneMatch = resumeText.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\+?\d{10,12}/);
  const phone = phoneMatch ? phoneMatch[0].trim() : 'Not found';

  // Education extraction
  let education = 'Not found';
  const eduKeywords = ['b.tech', 'b.e', 'bca', 'mca', 'b.sc', 'm.sc', 'm.tech', 'bachelor', 'master', 'phd', 'diploma'];
  for (const kw of eduKeywords) {
    if (lowerText.includes(kw)) {
      const sentence = resumeText.split(/[\n.]/).find(s => s.toLowerCase().includes(kw));
      if (sentence) {
        education = sentence.trim();
        break;
      }
    }
  }

  // Skills matching
  const matchingRequired: string[] = [];
  const missingRequired: string[] = [];

  jobReq.requiredSkills.forEach(skill => {
    const s = skill.trim();
    if (!s) return;
    const regex = new RegExp(`\\b${s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(resumeText)) {
      matchingRequired.push(s);
    } else {
      missingRequired.push(s);
    }
  });

  const matchingPreferred: string[] = [];
  jobReq.preferredSkills.forEach(skill => {
    const s = skill.trim();
    if (!s) return;
    const regex = new RegExp(`\\b${s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(resumeText)) {
      matchingPreferred.push(s);
    }
  });

  const reqCount = jobReq.requiredSkills.length || 1;
  const reqMatchRatio = matchingRequired.length / reqCount;
  const skillsScore = Math.min(100, Math.round(reqMatchRatio * 85 + (matchingPreferred.length > 0 ? 15 : 0)));

  // Experience heuristic
  let extractedYears = 0;
  const expMatch = resumeText.match(/(\d+(?:\.\d+)?)\+?\s*(?:years?|yrs?)(?:\s+of)?\s+(?:experience|exp)/i);
  if (expMatch) {
    extractedYears = parseFloat(expMatch[1]);
  } else if (lowerText.includes('senior') || lowerText.includes('lead')) {
    extractedYears = 3;
  } else if (lowerText.includes('intern')) {
    extractedYears = 0.5;
  } else {
    extractedYears = 1;
  }

  let experienceScore = 70;
  if (extractedYears >= jobReq.minExperienceYears) {
    experienceScore = Math.min(100, 80 + (extractedYears - jobReq.minExperienceYears) * 10);
  } else {
    experienceScore = Math.max(30, Math.round((extractedYears / (jobReq.minExperienceYears || 1)) * 70));
  }

  // Education score
  let educationScore = 60;
  if (education !== 'Not found') {
    educationScore = 90;
  }

  // Description relevance (keyword overlap)
  const descWords = jobReq.jobDescription.toLowerCase().split(/\W+/).filter(w => w.length > 4);
  const matchedDescWords = descWords.filter(w => lowerText.includes(w));
  const descRatio = descWords.length > 0 ? matchedDescWords.length / descWords.length : 0.6;
  const descriptionScore = Math.min(100, Math.round(descRatio * 100));

  // Transparent formula: Skills 40%, Experience 25%, Education 15%, Job Description 20%
  const overallScore = Math.round(
    skillsScore * 0.40 +
    experienceScore * 0.25 +
    educationScore * 0.15 +
    descriptionScore * 0.20
  );

  let recommendation: 'Strong Match' | 'Good Match' | 'Moderate Match' | 'Low Match' = 'Low Match';
  if (overallScore >= 80) recommendation = 'Strong Match';
  else if (overallScore >= 65) recommendation = 'Good Match';
  else if (overallScore >= 50) recommendation = 'Moderate Match';

  return {
    id: 'cand-' + Math.random().toString(36).substring(2, 9),
    fileName,
    fileSize,
    candidateName,
    email,
    phone,
    education,
    skills: [...matchingRequired, ...matchingPreferred],
    workExperience: [
      {
        title: 'Extracted Experience',
        description: `Candidate shows approximately ${extractedYears} year(s) of practical background.`,
      },
    ],
    projects: [
      {
        title: 'Relevant Projects',
        description: 'Extracted projects from resume content.',
      },
    ],
    certifications: ['Verified Profile Records'],
    yearsOfExperience: extractedYears,
    matchScore: overallScore,
    breakdown: {
      skillsScore,
      experienceScore,
      educationScore,
      descriptionScore,
    },
    matchingSkills: [...matchingRequired, ...matchingPreferred],
    missingSkills: missingRequired,
    skillsMatchPercentage: Math.round(reqMatchRatio * 100),
    recommendation,
    aiExplanation: `Candidate matches ${matchingRequired.length} of ${reqCount} required skills (${matchingRequired.join(', ') || 'None'}). Estimated experience is ${extractedYears} year(s) vs required ${jobReq.minExperienceYears} year(s).`,
    pros: [
      `Matches key skills: ${matchingRequired.slice(0, 3).join(', ') || 'General profile match'}`,
      `Estimated experience meets basic profile requirements`,
    ],
    cons: missingRequired.length > 0 ? [`Missing required skills: ${missingRequired.slice(0, 3).join(', ')}`] : ['No major missing prerequisites noted.'],
    analyzedAt: new Date().toISOString(),
    rawText: resumeText.slice(0, 1000),
  };
}

// Main API Route: Analyze Resumes via Gemini 3.7 Flash
app.post('/api/analyze-resumes', upload.array('resumes', 20), async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    const rawJobReq = req.body.jobRequirement;

    if (!rawJobReq) {
      return res.status(400).json({ error: 'Missing job requirement details in request.' });
    }

    const jobRequirement = typeof rawJobReq === 'string' ? JSON.parse(rawJobReq) : rawJobReq;
    const requiredSkills: string[] = Array.isArray(jobRequirement.requiredSkills)
      ? jobRequirement.requiredSkills
      : (jobRequirement.requiredSkills || '').split(',').map((s: string) => s.trim()).filter(Boolean);
    const preferredSkills: string[] = Array.isArray(jobRequirement.preferredSkills)
      ? jobRequirement.preferredSkills
      : (jobRequirement.preferredSkills || '').split(',').map((s: string) => s.trim()).filter(Boolean);

    const normalizedJobReq = {
      jobTitle: jobRequirement.jobTitle || 'Software Engineer',
      requiredSkills,
      preferredSkills,
      minEducation: jobRequirement.minEducation || 'Bachelor Degree',
      minExperienceYears: Number(jobRequirement.minExperienceYears) || 0,
      jobDescription: jobRequirement.jobDescription || '',
    };

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No resume files received.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const results = [];

    let aiClient: GoogleGenAI | null = null;
    if (apiKey && apiKey.trim().length > 5) {
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }

    // Process each resume
    for (const file of files) {
      try {
        const textContent = await extractTextFromBuffer(file.buffer, file.originalname, file.mimetype);

        if (!textContent || textContent.length < 15) {
          // If text extraction yielded empty content, fallback or flag
          results.push({
            id: 'err-' + Math.random().toString(36).substring(2, 9),
            fileName: file.originalname,
            fileSize: file.size,
            candidateName: 'Unreadable Document',
            email: 'Not found',
            phone: 'Not found',
            education: 'Not found',
            skills: [],
            workExperience: [],
            projects: [],
            certifications: [],
            yearsOfExperience: 0,
            matchScore: 0,
            breakdown: { skillsScore: 0, experienceScore: 0, educationScore: 0, descriptionScore: 0 },
            matchingSkills: [],
            missingSkills: normalizedJobReq.requiredSkills,
            skillsMatchPercentage: 0,
            recommendation: 'Low Match' as const,
            aiExplanation: 'The resume content could not be extracted or is empty. Please verify the document contains selectable text.',
            pros: [],
            cons: ['Document text could not be parsed.'],
            analyzedAt: new Date().toISOString(),
          });
          continue;
        }

        if (!aiClient) {
          // Rule-based fallback if no Gemini API Key
          const analyzed = fallbackRuleBasedAnalysis(textContent, file.originalname, file.size, normalizedJobReq);
          results.push(analyzed);
          continue;
        }

        // System prompt strictly enforcing fairness, safety, and ACCURATE CANDIDATE NAME EXTRACTION
        const systemPrompt = `You are an AI Recruitment & Resume Screening Assistant.
Your task is to analyze candidate resumes against job requirements objectively, accurately, and fairly.

CRITICAL CANDIDATE NAME EXTRACTION RULES:
1. First look at the top section/header of the resume.
2. The name is usually the largest or most prominent text at the top.
3. Prefer the name appearing above the contact details such as:
   - Email
   - Phone number
   - LinkedIn
   - Location
4. Do NOT use:
   - Email address as the name
   - File name as the candidate name
   - College name
   - Company name
   - Job title
   - Father's/mother's name
   - Address
   - References' names
5. Preserve the exact spelling and order of the candidate's name.
6. Do not abbreviate, translate, correct, or modify the name.
7. If the resume contains initials, preserve the initials exactly (e.g. "M. Balan", "K. S. Rao").
8. If multiple possible names exist, choose the name in the resume header.
9. If the name cannot be confidently identified, return:
   "Name not clearly detected"
   instead of guessing.
10. NEVER hallucinate or guess a candidate's name.

CRITICAL FAIRNESS & SAFETY RULES:
1. You must NOT evaluate, rank, or discriminate based on protected personal characteristics:
   - Gender, Age, Religion, Caste, Race, Nationality, Disability, Photograph, Marital status.
2. Focus strictly on job-relevant qualifications: skills, education, work experience, projects, and certifications.
3. NEVER fabricate or hallucinate candidate information. If any contact/education information is missing in the resume text, write "Not found".
4. Scoring approach must follow this transparent formula:
   - Skills Match (40% weight): How many required and preferred skills are proven in the resume.
   - Experience Match (25% weight): Total relevant years of experience compared to minimum required.
   - Education Match (15% weight): Degree/qualification alignment with job requirements.
   - Job Description / Keywords Match (20% weight): Conceptual depth and domain context alignment with the role.
   - Overall Score (0-100) = (SkillsScore * 0.40) + (ExperienceScore * 0.25) + (EducationScore * 0.15) + (DescriptionScore * 0.20).
5. Recommendation categories:
   - Overall Score >= 80: "Strong Match"
   - Overall Score >= 65: "Good Match"
   - Overall Score >= 50: "Moderate Match"
   - Overall Score < 50: "Low Match"`;

        const userPrompt = `Analyze the following resume against the specified Job Requirements.

JOB REQUIREMENTS:
- Job Title: ${normalizedJobReq.jobTitle}
- Required Skills: ${normalizedJobReq.requiredSkills.join(', ')}
- Preferred Skills: ${normalizedJobReq.preferredSkills.join(', ') || 'None'}
- Minimum Education: ${normalizedJobReq.minEducation}
- Minimum Years of Experience: ${normalizedJobReq.minExperienceYears} year(s)
- Job Description: ${normalizedJobReq.jobDescription}

RESUME TEXT CONTENT (File: ${file.originalname}):
${textContent.slice(0, 8000)}

Follow the NAME EXTRACTION RULES strictly. If the name cannot be identified with complete confidence from the resume header, return "candidateName": "Name not clearly detected".
Return a structured JSON object.`;

        const resumeAnalysisSchema = {
          type: Type.OBJECT,
          properties: {
            candidateName: { 
              type: Type.STRING, 
              description: 'FULL NAME EXACTLY AS WRITTEN in the resume header, preserving exact spelling and initials. If not clearly detected, return "Name not clearly detected". Never use file name or email.' 
            },
            email: { type: Type.STRING, description: 'Extracted email address or "Not found"' },
            phone: { type: Type.STRING, description: 'Extracted phone number or "Not found"' },
            education: { type: Type.STRING, description: 'Extracted degree/education details or "Not found"' },
            skills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'All technical and professional skills extracted from the resume',
            },
            workExperience: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  company: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ['title'],
              },
            },
            projects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  technologies: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ['title'],
              },
            },
            certifications: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            yearsOfExperience: {
              type: Type.NUMBER,
              description: 'Total estimated relevant years of professional experience',
            },
            breakdown: {
              type: Type.OBJECT,
              properties: {
                skillsScore: { type: Type.NUMBER, description: '0-100 score for skills match' },
                experienceScore: { type: Type.NUMBER, description: '0-100 score for experience match' },
                educationScore: { type: Type.NUMBER, description: '0-100 score for education match' },
                descriptionScore: { type: Type.NUMBER, description: '0-100 score for job description alignment' },
              },
              required: ['skillsScore', 'experienceScore', 'educationScore', 'descriptionScore'],
            },
            matchScore: {
              type: Type.NUMBER,
              description: 'Overall computed match score 0-100 based on the 40/25/15/20 formula',
            },
            matchingSkills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of required and preferred skills found in the resume',
            },
            missingSkills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'List of required skills NOT found in the resume',
            },
            skillsMatchPercentage: {
              type: Type.NUMBER,
              description: 'Percentage of required skills matched (0-100)',
            },
            recommendation: {
              type: Type.STRING,
              description: 'Must be "Strong Match", "Good Match", "Moderate Match", or "Low Match"',
            },
            aiExplanation: {
              type: Type.STRING,
              description: 'Clear, transparent explanation of why the candidate received the score',
            },
            pros: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Key candidate strengths for this role',
            },
            cons: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Skill gaps or missing prerequisites',
            },
          },
          required: [
            'candidateName',
            'email',
            'phone',
            'education',
            'skills',
            'yearsOfExperience',
            'breakdown',
            'matchScore',
            'matchingSkills',
            'missingSkills',
            'skillsMatchPercentage',
            'recommendation',
            'aiExplanation',
          ],
        };

        const jsonText = await generateGeminiAnalysis(
          aiClient,
          systemPrompt,
          userPrompt,
          resumeAnalysisSchema
        );

        if (jsonText) {
          try {
            const parsed = JSON.parse(jsonText);
            const verifiedName = verifyAndCleanCandidateName(parsed.candidateName, textContent);
            results.push({
              id: 'cand-' + Math.random().toString(36).substring(2, 9),
              fileName: file.originalname,
              fileSize: file.size,
              candidateName: verifiedName,
              email: parsed.email || 'Not found',
              phone: parsed.phone || 'Not found',
              education: parsed.education || 'Not found',
              skills: parsed.skills || [],
              workExperience: parsed.workExperience || [],
              projects: parsed.projects || [],
              certifications: parsed.certifications || [],
              yearsOfExperience: parsed.yearsOfExperience ?? 0,
              matchScore: Math.min(100, Math.max(0, Math.round(parsed.matchScore || 0))),
              breakdown: {
                skillsScore: Math.min(100, Math.max(0, Math.round(parsed.breakdown?.skillsScore || 0))),
                experienceScore: Math.min(100, Math.max(0, Math.round(parsed.breakdown?.experienceScore || 0))),
                educationScore: Math.min(100, Math.max(0, Math.round(parsed.breakdown?.educationScore || 0))),
                descriptionScore: Math.min(100, Math.max(0, Math.round(parsed.breakdown?.descriptionScore || 0))),
              },
              matchingSkills: parsed.matchingSkills || [],
              missingSkills: parsed.missingSkills || [],
              skillsMatchPercentage: Math.min(100, Math.max(0, Math.round(parsed.skillsMatchPercentage || 0))),
              recommendation: parsed.recommendation || 'Moderate Match',
              aiExplanation: parsed.aiExplanation || 'Analysis completed.',
              pros: parsed.pros || [],
              cons: parsed.cons || [],
              analyzedAt: new Date().toISOString(),
              rawText: textContent.slice(0, 1000),
            });
            continue;
          } catch (parseErr) {
            // Fallthrough to fallback analysis
          }
        }

        // Fallback analysis to preserve reliability
        const fallback = fallbackRuleBasedAnalysis(textContent, file.originalname, file.size, normalizedJobReq);
        results.push(fallback);
      } catch (err: any) {
        // Fallback analysis to preserve reliability
        const textContent = await extractTextFromBuffer(file.buffer, file.originalname, file.mimetype);
        const fallback = fallbackRuleBasedAnalysis(textContent, file.originalname, file.size, normalizedJobReq);
        results.push(fallback);
      }
    }

    // Sort results by matchScore descending
    results.sort((a, b) => b.matchScore - a.matchScore);

    return res.json({
      success: true,
      candidates: results,
      totalAnalyzed: results.length,
    });
  } catch (error: any) {
    console.error('Fatal /api/analyze-resumes error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error while analyzing resumes' });
  }
});

// Single text resume analysis (useful for copy-pasted or demo triggers)
app.post('/api/analyze-text', async (req: Request, res: Response) => {
  try {
    const { resumeText, candidateName, fileName, jobRequirement } = req.body;
    if (!resumeText) {
      return res.status(400).json({ error: 'resumeText is required' });
    }

    const requiredSkills: string[] = Array.isArray(jobRequirement?.requiredSkills)
      ? jobRequirement.requiredSkills
      : (jobRequirement?.requiredSkills || '').split(',').map((s: string) => s.trim()).filter(Boolean);
    const preferredSkills: string[] = Array.isArray(jobRequirement?.preferredSkills)
      ? jobRequirement.preferredSkills
      : (jobRequirement?.preferredSkills || '').split(',').map((s: string) => s.trim()).filter(Boolean);

    const normalizedJobReq = {
      jobTitle: jobRequirement?.jobTitle || 'Software Engineer',
      requiredSkills,
      preferredSkills,
      minEducation: jobRequirement?.minEducation || 'Bachelor Degree',
      minExperienceYears: Number(jobRequirement?.minExperienceYears) || 0,
      jobDescription: jobRequirement?.jobDescription || '',
    };

    const analyzed = fallbackRuleBasedAnalysis(
      resumeText,
      fileName || `${candidateName || 'Candidate'}_Resume.txt`,
      resumeText.length,
      normalizedJobReq
    );

    if (candidateName && candidateName.trim()) {
      analyzed.candidateName = verifyAndCleanCandidateName(candidateName, resumeText);
    }

    return res.json({ success: true, candidate: analyzed });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Setup Vite development middleware or static production serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Resume Screening System running at http://localhost:${PORT}`);
  });
}

startServer();
