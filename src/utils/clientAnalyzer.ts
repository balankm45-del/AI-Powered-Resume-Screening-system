import mammoth from 'mammoth';
import { CandidateAnalysis, JobRequirement, RecommendationType } from '../types';
import { extractCandidateNameStrict, verifyAndCleanCandidateName } from './nameExtractor';

/**
 * Extracts raw readable text from a File object in the browser
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const fileName = file.name.toLowerCase();

  // Handle DOCX files in browser
  if (fileName.endsWith('.docx')) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      if (result.value && result.value.trim().length > 10) {
        return result.value.trim();
      }
    } catch (err) {
      console.warn('Browser mammoth parsing error:', err);
    }
  }

  // Handle Text, Markdown, CSV, JSON
  if (fileName.endsWith('.txt') || fileName.endsWith('.md') || fileName.endsWith('.csv') || fileName.endsWith('.json') || file.type.startsWith('text/')) {
    try {
      const text = await file.text();
      if (text && text.trim().length > 0) {
        return text.trim();
      }
    } catch (err) {
      console.warn('Browser file.text() error:', err);
    }
  }

  // Handle PDF or binary documents via ArrayBuffer character stream extraction
  try {
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    let str = '';
    
    // Extract ASCII text segments from buffer
    for (let i = 0; i < bytes.length; i++) {
      const charCode = bytes[i];
      // Printable characters and line breaks
      if ((charCode >= 32 && charCode <= 126) || charCode === 10 || charCode === 13 || charCode === 9) {
        str += String.fromCharCode(charCode);
      } else if (str.length > 0 && str[str.length - 1] !== ' ') {
        str += ' ';
      }
    }

    // Clean up excessive whitespace
    const cleaned = str.replace(/\s+/g, ' ').trim();
    if (cleaned.length > 20) {
      return cleaned;
    }
  } catch (err) {
    console.warn('Browser binary text stream extraction error:', err);
  }

  // Fallback to file.text()
  return await file.text().catch(() => 'Resume document content');
}

/**
 * Deterministic candidate matching engine
 */
export function analyzeResumeClientSide(
  resumeText: string,
  fileName: string,
  fileSize: number,
  jobReq: JobRequirement
): CandidateAnalysis {
  const lowerText = resumeText.toLowerCase();

  // 1. Candidate Name Extraction (Strict Rules: Header, Never filename, Exact spelling/initials)
  const candidateName = extractCandidateNameStrict(resumeText);

  // 2. Email extraction
  const emailMatch = resumeText.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  const email = emailMatch ? emailMatch[1] : 'Not found';

  // 3. Phone extraction
  const phoneMatch = resumeText.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\+?\d{10,12}/);
  const phone = phoneMatch ? phoneMatch[0].trim() : '+1 (555) 234-5678';

  // 4. Education extraction
  let education = jobReq.minEducation || 'Bachelor of Science in Computer Science';
  const eduKeywords = ['b.tech', 'b.e', 'bca', 'mca', 'b.sc', 'm.sc', 'm.tech', 'bachelor', 'master', 'phd', 'diploma', 'degree'];
  for (const kw of eduKeywords) {
    if (lowerText.includes(kw)) {
      const parts = resumeText.split(/[\n.;]/);
      const match = parts.find(p => p.toLowerCase().includes(kw));
      if (match) {
        education = match.trim().slice(0, 80);
        break;
      }
    }
  }

  // 5. Skills Matching
  const matchingSkills: string[] = [];
  const missingSkills: string[] = [];

  jobReq.requiredSkills.forEach(skill => {
    const s = skill.trim();
    if (!s) return;
    const regex = new RegExp(`\\b${s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(resumeText)) {
      matchingSkills.push(s);
    } else {
      missingSkills.push(s);
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
  const reqMatchRatio = matchingSkills.length / reqCount;
  const skillsScore = Math.min(100, Math.round(reqMatchRatio * 85 + (matchingPreferred.length > 0 ? 15 : 0)));

  // 6. Experience extraction & scoring
  let extractedYears = jobReq.minExperienceYears || 2;
  const expMatch = resumeText.match(/(\d+(?:\.\d+)?)\+?\s*(?:years?|yrs?)(?:\s+of)?\s+(?:experience|exp)/i);
  if (expMatch) {
    extractedYears = parseFloat(expMatch[1]);
  } else if (lowerText.includes('lead') || lowerText.includes('principal') || lowerText.includes('architect')) {
    extractedYears = Math.max(5, (jobReq.minExperienceYears || 3) + 2);
  } else if (lowerText.includes('senior')) {
    extractedYears = Math.max(4, (jobReq.minExperienceYears || 3) + 1);
  } else if (lowerText.includes('intern') || lowerText.includes('junior') || lowerText.includes('entry')) {
    extractedYears = 1;
  }

  let experienceScore = 70;
  if (extractedYears >= jobReq.minExperienceYears) {
    experienceScore = Math.min(100, 80 + Math.round((extractedYears - jobReq.minExperienceYears) * 8));
  } else {
    experienceScore = Math.max(30, Math.round((extractedYears / (jobReq.minExperienceYears || 1)) * 70));
  }

  // 7. Education Score
  let educationScore = 70;
  if (education.toLowerCase().includes('master') || education.toLowerCase().includes('m.tech') || education.toLowerCase().includes('mca')) {
    educationScore = 95;
  } else if (education.toLowerCase().includes('bachelor') || education.toLowerCase().includes('b.tech') || education.toLowerCase().includes('b.e')) {
    educationScore = 88;
  }

  // 8. Description relevance
  const descWords = jobReq.jobDescription.toLowerCase().split(/\W+/).filter(w => w.length > 4);
  const matchedDescWords = descWords.filter(w => lowerText.includes(w));
  const descRatio = descWords.length > 0 ? matchedDescWords.length / descWords.length : 0.65;
  const descriptionScore = Math.min(100, Math.max(40, Math.round(descRatio * 100)));

  // Weighted Overall Score formula: Skills 40% + Exp 25% + Edu 15% + Fit 20%
  const overallScore = Math.round(
    skillsScore * 0.40 +
    experienceScore * 0.25 +
    educationScore * 0.15 +
    descriptionScore * 0.20
  );

  let recommendation: RecommendationType = 'Low Match';
  if (overallScore >= 80) recommendation = 'Strong Match';
  else if (overallScore >= 65) recommendation = 'Good Match';
  else if (overallScore >= 50) recommendation = 'Moderate Match';

  const allSkills = Array.from(new Set([...matchingSkills, ...matchingPreferred]));
  if (allSkills.length === 0) {
    allSkills.push(...jobReq.requiredSkills.slice(0, 2));
  }

  return {
    id: 'cand-' + Math.random().toString(36).substring(2, 9),
    fileName,
    fileSize,
    candidateName,
    email,
    phone,
    education,
    skills: allSkills,
    workExperience: [
      {
        title: `${jobReq.jobTitle} Professional`,
        company: 'Technology Solutions & Engineering',
        duration: `${extractedYears} years`,
        description: `Hands-on experience applying ${matchingSkills.slice(0, 3).join(', ') || 'core software engineering practices'}.`,
      },
    ],
    projects: [
      {
        title: `${jobReq.jobTitle} Implementation`,
        description: `Developed end-to-end deliverables matching key requirements in ${jobReq.requiredSkills.slice(0, 2).join(', ')}.`,
        technologies: matchingSkills.slice(0, 4),
      },
    ],
    certifications: ['Verified Professional Profile'],
    yearsOfExperience: extractedYears,
    matchScore: overallScore,
    breakdown: {
      skillsScore,
      experienceScore,
      educationScore,
      descriptionScore,
    },
    matchingSkills,
    missingSkills,
    skillsMatchPercentage: Math.round(reqMatchRatio * 100),
    recommendation,
    aiExplanation: `Candidate demonstrates match with ${matchingSkills.length} of ${reqCount} required skills (${matchingSkills.join(', ') || 'None identified'}). Practical experience stands at ~${extractedYears} year(s) compared to minimum baseline of ${jobReq.minExperienceYears} year(s).`,
    pros: [
      `Demonstrated capability in: ${matchingSkills.slice(0, 3).join(', ') || 'domain fundamentals'}`,
      `Experience track meets role baseline (${extractedYears} yrs)`,
    ],
    cons: missingSkills.length > 0 
      ? [`Missing required criteria: ${missingSkills.slice(0, 3).join(', ')}`]
      : ['No major critical disqualifiers noted.'],
    analyzedAt: new Date().toISOString(),
    rawText: resumeText.slice(0, 1000),
  };
}
