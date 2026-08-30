import { CandidateAnalysis, JobRequirement } from '../types';

export function exportCandidatesToCSV(candidates: CandidateAnalysis[], jobRequirement: JobRequirement) {
  if (!candidates || candidates.length === 0) return;

  const headers = [
    'Rank',
    'Candidate Name',
    'Email',
    'Phone',
    'Match Score (%)',
    'Recommendation',
    'Required Skills Matched (%)',
    'Matching Skills',
    'Missing Skills',
    'Skills Score (40%)',
    'Experience Score (25%)',
    'Education Score (15%)',
    'Job Description Fit (20%)',
    'Years of Experience',
    'Education',
    'AI Rationale Summary',
    'File Name',
    'Analyzed At',
  ];

  const rows = candidates.map((cand, idx) => {
    return [
      idx + 1,
      `"${(cand.candidateName || '').replace(/"/g, '""')}"`,
      `"${(cand.email || '').replace(/"/g, '""')}"`,
      `"${(cand.phone || '').replace(/"/g, '""')}"`,
      cand.matchScore,
      `"${cand.recommendation}"`,
      cand.skillsMatchPercentage,
      `"${(cand.matchingSkills || []).join('; ').replace(/"/g, '""')}"`,
      `"${(cand.missingSkills || []).join('; ').replace(/"/g, '""')}"`,
      cand.breakdown.skillsScore,
      cand.breakdown.experienceScore,
      cand.breakdown.educationScore,
      cand.breakdown.descriptionScore,
      cand.yearsOfExperience,
      `"${(cand.education || '').replace(/"/g, '""')}"`,
      `"${(cand.aiExplanation || '').replace(/"/g, '""')}"`,
      `"${(cand.fileName || '').replace(/"/g, '""')}"`,
      `"${cand.analyzedAt}"`,
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const cleanTitle = jobRequirement.jobTitle.replace(/[^a-zA-Z0-9]/g, '_');
  link.setAttribute('download', `AI_Screening_Rankings_${cleanTitle}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
