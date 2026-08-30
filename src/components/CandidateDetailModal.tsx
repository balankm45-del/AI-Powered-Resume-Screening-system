import React from 'react';
import { 
  X, 
  Check, 
  AlertTriangle, 
  ShieldCheck, 
  Mail, 
  Phone, 
  GraduationCap, 
  Briefcase, 
  Code2, 
  FolderGit2, 
  Award, 
  FileText, 
  Sparkles, 
  Download, 
  Printer, 
  Info,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { CandidateAnalysis, JobRequirement } from '../types';

interface CandidateDetailModalProps {
  candidate: CandidateAnalysis | null;
  jobRequirement: JobRequirement;
  onClose: () => void;
}

export const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({
  candidate,
  jobRequirement,
  onClose,
}) => {
  if (!candidate) return null;

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 65) return 'text-blue-700 bg-blue-50 border-blue-200';
    if (score >= 50) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-slate-700 bg-slate-100 border-slate-200';
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#06182a]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      
      {/* Modal Card */}
      <div className="bg-white rounded-3xl border border-[#e6ebf1] shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-6 bg-[#0a2540] text-white relative flex items-start justify-between border-b border-[#1e3a5a]">
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-[#1e3a5a] border border-blue-400/30 flex items-center justify-center text-blue-200 font-serif font-bold text-2xl shadow-inner">
              {candidate.candidateName === 'Name not clearly detected' ? '?' : (candidate.candidateName.charAt(0) || 'C')}
            </div>
            
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className={`text-2xl font-serif font-bold tracking-tight text-white ${
                  candidate.candidateName === 'Name not clearly detected' ? 'italic text-slate-300' : ''
                }`}>
                  {candidate.candidateName}
                </h2>
                {candidate.isDemo && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/30 text-purple-200 border border-purple-400/40">
                    DEMO DATA
                  </span>
                )}
                <span className="px-3 py-0.5 rounded-full text-xs font-medium bg-white/10 text-blue-200 border border-white/15">
                  Target: {jobRequirement.jobTitle}
                </span>
              </div>

              {/* Contact sub-line */}
              <div className="mt-2 flex flex-wrap items-center text-xs text-blue-200/90 gap-x-4 gap-y-1">
                <span className="flex items-center">
                  <Mail className="w-3.5 h-3.5 mr-1 text-blue-300" />
                  {candidate.email}
                </span>
                <span className="flex items-center">
                  <Phone className="w-3.5 h-3.5 mr-1 text-blue-300" />
                  {candidate.phone}
                </span>
                <span className="flex items-center">
                  <FileText className="w-3.5 h-3.5 mr-1 text-blue-300" />
                  {candidate.fileName}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Section 1: Overall Score & 4-Factor Breakdown */}
          <div className="p-5 bg-[#fcfdfe] rounded-2xl border border-[#e6ebf1]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e6ebf1]">
              
              {/* Overall Score */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-white border-2 border-[#0a2540] flex flex-col items-center justify-center shadow-xs">
                  <span className="text-2xl font-serif font-bold text-[#0a2540] tracking-tight">
                    {candidate.matchScore}%
                  </span>
                  <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400">Score</span>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                    Evaluation Rationale
                  </div>
                  <div className="text-lg font-serif font-bold text-slate-900 flex items-center">
                    <span>{candidate.recommendation}</span>
                  </div>
                  <p className="text-xs text-slate-500 font-sans">
                    Matches <strong className="text-slate-900">{candidate.skillsMatchPercentage}%</strong> of required criteria
                  </p>
                </div>
              </div>

              {/* Formula Badge */}
              <div className="text-right hidden sm:block">
                <span className="inline-flex items-center text-[10px] uppercase font-bold tracking-wider text-slate-500 bg-white px-3.5 py-1.5 rounded-full border border-[#e6ebf1]">
                  Skills 40% + Exp 25% + Edu 15% + Fit 20%
                </span>
              </div>
            </div>

            {/* 4 Score Breakdown Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-4">
              
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
                <div className="flex justify-between text-xs font-semibold text-slate-600">
                  <span className="text-[11px]">Skills (40%)</span>
                  <span className="font-serif font-bold text-blue-700">{candidate.breakdown.skillsScore}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${candidate.breakdown.skillsScore}%` }} />
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
                <div className="flex justify-between text-xs font-semibold text-slate-600">
                  <span className="text-[11px]">Experience (25%)</span>
                  <span className="font-serif font-bold text-indigo-700">{candidate.breakdown.experienceScore}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${candidate.breakdown.experienceScore}%` }} />
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
                <div className="flex justify-between text-xs font-semibold text-slate-600">
                  <span className="text-[11px]">Education (15%)</span>
                  <span className="font-serif font-bold text-teal-700">{candidate.breakdown.educationScore}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-teal-600 rounded-full" style={{ width: `${candidate.breakdown.educationScore}%` }} />
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80">
                <div className="flex justify-between text-xs font-semibold text-slate-600">
                  <span className="text-[11px]">Job Fit (20%)</span>
                  <span className="font-serif font-bold text-purple-700">{candidate.breakdown.descriptionScore}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-purple-600 rounded-full" style={{ width: `${candidate.breakdown.descriptionScore}%` }} />
                </div>
              </div>

            </div>
          </div>

          {/* Section 2: Skill Analysis (Matching vs Missing) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Matching Skills */}
            <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-200/80">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center mb-3">
                <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-600" />
                Matching Required Skills ({candidate.matchingSkills.length})
              </h4>

              {candidate.matchingSkills.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No matching job requirements skills detected.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {candidate.matchingSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white text-emerald-900 border border-emerald-300 shadow-2xs"
                    >
                      <Check className="w-3 h-3 mr-1 text-emerald-600 stroke-[3]" />
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Missing Skills */}
            <div className="p-4 bg-red-50/50 rounded-2xl border border-red-200/80">
              <h4 className="text-xs font-bold uppercase tracking-wider text-red-900 flex items-center mb-3">
                <XCircle className="w-4 h-4 mr-1.5 text-red-500" />
                Missing Required Skills ({candidate.missingSkills.length})
              </h4>

              {candidate.missingSkills.length === 0 ? (
                <p className="text-xs text-emerald-700 font-medium">✓ Candidate possesses all listed required skills!</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {candidate.missingSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white text-red-800 border border-red-300 shadow-2xs"
                    >
                      <X className="w-3 h-3 mr-1 text-red-500 stroke-[3]" />
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Section 3: AI Explanation & Evaluation Rationale */}
          <div className="p-5 bg-[#fdfdfd] rounded-2xl border-l-4 border-[#0a2540] border border-slate-200 shadow-2xs">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">Qualitative Assessment</p>
            <h4 className="text-base font-serif font-bold text-slate-900 flex items-center mb-2">
              <Sparkles className="w-4 h-4 mr-1.5 text-blue-600" />
              AI Match Synthesis & Rationale
            </h4>
            <blockquote className="font-serif italic text-slate-700 leading-relaxed text-sm bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/60">
              "{candidate.aiExplanation}"
            </blockquote>

            {/* Pros & Cons */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-widest block mb-1.5">
                  Key Strengths:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {candidate.pros?.map((pro, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-emerald-600 mr-2 font-bold">✓</span>
                      <span>{pro}</span>
                    </li>
                  )) || <li>Profile meets baseline expectations.</li>}
                </ul>
              </div>

              <div>
                <span className="text-[10px] font-bold text-amber-900 uppercase tracking-widest block mb-1.5">
                  Areas for Review / Gaps:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {candidate.cons?.map((con, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-amber-600 mr-2 font-bold">!</span>
                      <span>{con}</span>
                    </li>
                  )) || <li>No critical deficiencies noted.</li>}
                </ul>
              </div>
            </div>
          </div>

          {/* Section 4: All Extracted Skills */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center mb-2.5">
              <Code2 className="w-4 h-4 mr-1.5 text-slate-600" />
              All Extracted Candidate Skills ({candidate.skills.length})
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {candidate.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-slate-100 text-slate-800 rounded-full text-xs font-medium border border-slate-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Section 5: Work Experience & Education Timeline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Experience */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center mb-3">
                <Briefcase className="w-4 h-4 mr-1.5 text-blue-600" />
                Experience History ({candidate.yearsOfExperience} years)
              </h4>
              {candidate.workExperience.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No specific work entries detailed.</p>
              ) : (
                <div className="space-y-3">
                  {candidate.workExperience.map((exp, i) => (
                    <div key={i} className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200 text-xs">
                      <div className="font-serif font-bold text-slate-900 text-sm">{exp.title}</div>
                      {exp.company && <div className="text-slate-600 font-medium mt-0.5">{exp.company} • {exp.duration}</div>}
                      {exp.description && <p className="text-slate-500 mt-1.5 leading-relaxed">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Education & Certifications */}
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center mb-2">
                  <GraduationCap className="w-4 h-4 mr-1.5 text-indigo-600" />
                  Education
                </h4>
                <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200 text-xs font-medium text-slate-800">
                  {candidate.education}
                </div>
              </div>

              {candidate.certifications && candidate.certifications.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center mb-2">
                    <Award className="w-4 h-4 mr-1.5 text-amber-600" />
                    Certifications
                  </h4>
                  <div className="space-y-1.5">
                    {candidate.certifications.map((cert, i) => (
                      <div key={i} className="p-2.5 bg-amber-50/60 border border-amber-200 text-amber-900 rounded-lg text-xs font-medium">
                        {cert}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Section 6: Projects */}
          {candidate.projects && candidate.projects.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center mb-3">
                <FolderGit2 className="w-4 h-4 mr-1.5 text-purple-600" />
                Extracted Project Portfolio
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {candidate.projects.map((proj, i) => (
                  <div key={i} className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200 text-xs">
                    <div className="font-serif font-bold text-slate-900 text-sm">{proj.title}</div>
                    {proj.description && <p className="text-slate-600 mt-1 leading-relaxed">{proj.description}</p>}
                    {proj.technologies && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {proj.technologies.map((t) => (
                          <span key={t} className="px-2 py-0.5 bg-white border border-slate-200 text-slate-600 rounded-full text-[10px]">
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Safety Notice Item 14 */}
          <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl flex items-start space-x-3 text-xs text-amber-900">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-serif font-bold">Human-in-the-Loop Assistive Notice:</strong>
              <p className="mt-0.5 leading-relaxed font-sans">
                AI-generated screening is an assistive tool. Final hiring decisions must be made by a qualified human recruiter. This evaluation is strictly merit-oriented without consideration of any protected personal demographic attributes.
              </p>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-[#e6ebf1] flex items-center justify-between">
          <button
            onClick={handlePrint}
            className="inline-flex items-center px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-full transition-colors shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
            Print Profile
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#0a2540] hover:bg-[#123659] text-white text-xs font-semibold rounded-full transition-colors shadow-2xs"
          >
            Close Profile
          </button>
        </div>

      </div>

    </div>
  );
};
