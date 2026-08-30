export type RecommendationType = 'Strong Match' | 'Good Match' | 'Moderate Match' | 'Low Match';

export interface JobRequirement {
  id: string;
  jobTitle: string;
  department?: string;
  requiredSkills: string[];
  preferredSkills: string[];
  minEducation: string;
  minExperienceYears: number;
  jobDescription: string;
  location?: string;
}

export interface WorkExperienceItem {
  title: string;
  company?: string;
  duration?: string;
  description?: string;
}

export interface ProjectItem {
  title: string;
  description?: string;
  technologies?: string[];
}

export interface ScoreBreakdown {
  skillsScore: number; // 0-100 (40% weight)
  experienceScore: number; // 0-100 (25% weight)
  educationScore: number; // 0-100 (15% weight)
  descriptionScore: number; // 0-100 (20% weight)
}

export interface CandidateAnalysis {
  id: string;
  fileName: string;
  fileSize?: number;
  candidateName: string;
  email: string;
  phone: string;
  education: string;
  skills: string[];
  workExperience: WorkExperienceItem[];
  projects: ProjectItem[];
  certifications: string[];
  yearsOfExperience: number;
  matchScore: number; // 0-100
  breakdown: ScoreBreakdown;
  matchingSkills: string[];
  missingSkills: string[];
  skillsMatchPercentage: number;
  recommendation: RecommendationType;
  aiExplanation: string;
  pros: string[];
  cons: string[];
  isDemo?: boolean;
  analyzedAt: string;
  rawText?: string;
}

export interface UploadedFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  status: 'pending' | 'uploading' | 'analyzing' | 'completed' | 'error';
  errorMessage?: string;
  result?: CandidateAnalysis;
}

export interface AnalysisStats {
  totalResumes: number;
  analyzedCount: number;
  strongMatches: number;
  goodMatches: number;
  moderateMatches: number;
  lowMatches: number;
  averageScore: number;
  highestScore: number;
}
