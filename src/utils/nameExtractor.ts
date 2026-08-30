/**
 * Strict Candidate Name Extraction Utility
 * 
 * Rules:
 * 1. First look at the top section/header of the resume.
 * 2. The name is usually the largest or most prominent text at the top.
 * 3. Prefer the name appearing above the contact details (Email, Phone, LinkedIn, Location).
 * 4. Do NOT use:
 *    - Email address as the name
 *    - File name as the candidate name
 *    - College name
 *    - Company name
 *    - Job title
 *    - Father's/mother's name
 *    - Address
 *    - References' names
 * 5. Preserve the exact spelling and order of the candidate's name.
 * 6. Do not abbreviate, translate, correct, or modify the name.
 * 7. If the resume contains initials, preserve the initials exactly.
 * 8. If multiple possible names exist, choose the name in the resume header.
 * 9. If the name cannot be confidently identified, return "Name not clearly detected" instead of guessing.
 */

const FORBIDDEN_WORDS = new Set([
  'resume', 'curriculum', 'vitae', 'cv', 'profile', 'summary', 'objective',
  'experience', 'education', 'skills', 'projects', 'certifications',
  'contact', 'details', 'personal', 'information', 'declaration',
  'references', 'father', 'mother', 'address', 'page', 'email', 'phone',
  'linkedin', 'github', 'portfolio', 'developer', 'engineer', 'manager',
  'consultant', 'architect', 'analyst', 'intern', 'fresher', 'associate',
  'lead', 'senior', 'junior', 'full stack', 'frontend', 'backend',
  'university', 'college', 'institute', 'school', 'technology', 'technologies',
  'solutions', 'services', 'corporation', 'limited', 'pvt', 'ltd', 'inc',
  'india', 'usa', 'united states', 'canada', 'bangalore', 'chennai', 'hyderabad',
  'delhi', 'mumbai', 'pune', 'california', 'texas', 'new york', 'london'
]);

const JOB_TITLE_REGEX = /^(?:Senior|Junior|Lead|Principal|Associate|Staff|Chief|Head|Director|Vice President|VP|Intern|Full Stack|Frontend|Backend|DevOps|Cloud|Data|AI|ML|Software|Web|Mobile|iOS|Android|System|Network|QA|Test|Product|Project|UI\/UX|Graphic)?\s*(?:Software|Developer|Engineer|Architect|Consultant|Designer|Scientist|Analyst|Programmer|Administrator|Specialist|Executive|Manager|Officer|Representative|Technician)\b/i;

/**
 * Validates whether a candidate string looks like a legitimate candidate name
 */
export function isValidCandidateName(candidate: string, originalText: string): boolean {
  if (!candidate || typeof candidate !== 'string') return false;
  const trimmed = candidate.trim();

  // Length limits
  if (trimmed.length < 2 || trimmed.length > 45) return false;

  // Must not be email or phone or url
  if (trimmed.includes('@') || /^\+?\d/.test(trimmed) || /https?:\/\//i.test(trimmed) || /www\./i.test(trimmed)) {
    return false;
  }

  // Must not match job titles directly
  if (JOB_TITLE_REGEX.test(trimmed)) {
    return false;
  }

  const lower = trimmed.toLowerCase();

  // Must not contain pure forbidden section headings or keywords
  if (FORBIDDEN_WORDS.has(lower)) return false;

  // Check if string contains forbidden phrases
  if (lower.includes('curriculum vitae') || lower.includes('resume') || lower.includes('bio-data') || lower.includes('biodata')) {
    return false;
  }

  // Check word tokens
  const words = trimmed.split(/[\s,]+/).filter(Boolean);
  if (words.length === 0 || words.length > 5) return false;

  // Words should consist of alphabets, initials (e.g. 'A.', 'K.'), hyphens, apostrophes
  const validWordPattern = /^[A-Za-z][A-Za-z.\-']*$/;
  for (const word of words) {
    if (!validWordPattern.test(word)) {
      return false;
    }
    if (FORBIDDEN_WORDS.has(word.toLowerCase())) {
      return false;
    }
  }

  // Verify that the candidate name appears in the original text (exact case or close)
  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`\\b${escaped}\\b`, 'i');
  return regex.test(originalText);
}

/**
 * Extracts and verifies candidate's full name from resume text strictly following the rules
 */
export function extractCandidateNameStrict(resumeText: string): string {
  if (!resumeText || resumeText.trim().length === 0) {
    return 'Name not clearly detected';
  }

  // Extract top section / header (first ~1200 characters or lines before summary/experience)
  const topText = resumeText.slice(0, 1500);
  const lines = topText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  // 1. Check for explicit "Name:" / "Full Name:" / "Candidate Name:" headers
  const explicitPrefixRegex = /^(?:Name|Full\s*Name|Candidate\s*Name|Applicant\s*Name)\s*[:\-]\s*([A-Za-z][A-Za-z.\s\-']{1,40})/im;
  const explicitMatch = topText.match(explicitPrefixRegex);
  if (explicitMatch && explicitMatch[1]) {
    const candidate = explicitMatch[1].trim().split(/[\t,|•]/)[0].trim();
    if (isValidCandidateName(candidate, resumeText)) {
      return candidate;
    }
  }

  // 2. Locate line index of first contact detail (Email / Phone / LinkedIn / Location)
  let contactLineIndex = lines.length;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (
      line.includes('@') ||
      /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\+?\d{10,12}/.test(line) ||
      /linkedin\.com/i.test(line) ||
      /github\.com/i.test(line) ||
      /^(?:Phone|Email|Mobile|Contact|Address)\s*[:\-]/i.test(line)
    ) {
      contactLineIndex = i;
      break;
    }
  }

  // 3. Evaluate header lines above contact information (or first 5 non-empty lines)
  const maxSearchIndex = Math.min(contactLineIndex + 1, Math.min(lines.length, 6));

  for (let i = 0; i < maxSearchIndex; i++) {
    let line = lines[i];

    // Clean common leading labels or bullets
    line = line.replace(/^[•\-\*#]+\s*/, '').trim();

    // Skip if contains contact info on the same line; isolate text before contact info
    if (line.includes('@') || /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(line)) {
      const parts = line.split(/[|•,\t]/);
      for (const part of parts) {
        const cleanPart = part.trim();
        if (isValidCandidateName(cleanPart, resumeText)) {
          return cleanPart;
        }
      }
      continue;
    }

    // Split line by separators like | or • or tabs in case name is grouped with titles
    const lineSegments = line.split(/[|•\t]/).map(s => s.trim()).filter(Boolean);
    for (const segment of lineSegments) {
      // Must start with an uppercase letter or initial
      if (/^[A-Z]/.test(segment)) {
        // Must contain 1 to 4 words
        const words = segment.split(/\s+/);
        if (words.length >= 1 && words.length <= 4) {
          if (isValidCandidateName(segment, resumeText)) {
            return segment;
          }
        }
      }
    }
  }

  // 4. Look for 2-3 capitalized words at the very beginning of the resume text
  const initialHeaderMatch = topText.match(/^\s*([A-Z][a-zA-Z.\-']+(?:\s+[A-Z][a-zA-Z.\-']+){1,3})/);
  if (initialHeaderMatch && initialHeaderMatch[1]) {
    const candidate = initialHeaderMatch[1].trim();
    if (isValidCandidateName(candidate, resumeText)) {
      return candidate;
    }
  }

  // 5. If not confidently identified, adhere strictly to rule 10
  return 'Name not clearly detected';
}

/**
 * Strict verification of candidate name against original resume text
 */
export function verifyAndCleanCandidateName(
  candidateName: string | undefined | null,
  resumeText: string
): string {
  if (!candidateName || candidateName === 'Not found' || candidateName.trim() === '') {
    return extractCandidateNameStrict(resumeText);
  }

  const trimmed = candidateName.trim();
  if (trimmed === 'Name not clearly detected') {
    return 'Name not clearly detected';
  }

  if (isValidCandidateName(trimmed, resumeText)) {
    // Exact match in text: find the exact casing from the original resume text if possible
    const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = resumeText.match(new RegExp(`\\b${escaped}\\b`, 'i'));
    if (match && match[0]) {
      return match[0].trim();
    }
    return trimmed;
  }

  // Fallback to strict extraction
  return extractCandidateNameStrict(resumeText);
}
