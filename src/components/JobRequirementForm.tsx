import React, { useState } from 'react';
import { 
  Briefcase, 
  Plus, 
  X, 
  BookOpen, 
  Clock, 
  FileText, 
  Sparkles, 
  Check, 
  RotateCcw,
  ArrowRight
} from 'lucide-react';
import { JobRequirement } from '../types';
import { DEFAULT_JOB_REQUIREMENTS } from '../data/sampleData';

interface JobRequirementFormProps {
  jobRequirement: JobRequirement;
  setJobRequirement: (req: JobRequirement) => void;
  onProceedToUpload: () => void;
}

export const JobRequirementForm: React.FC<JobRequirementFormProps> = ({
  jobRequirement,
  setJobRequirement,
  onProceedToUpload,
}) => {
  const [reqSkillInput, setReqSkillInput] = useState('');
  const [prefSkillInput, setPrefSkillInput] = useState('');
  const [savedFeedback, setSavedFeedback] = useState(false);

  const handleAddRequiredSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = reqSkillInput.trim();
    if (trimmed && !jobRequirement.requiredSkills.includes(trimmed)) {
      setJobRequirement({
        ...jobRequirement,
        requiredSkills: [...jobRequirement.requiredSkills, trimmed],
      });
      setReqSkillInput('');
    }
  };

  const handleRemoveRequiredSkill = (skillToRemove: string) => {
    setJobRequirement({
      ...jobRequirement,
      requiredSkills: jobRequirement.requiredSkills.filter(s => s !== skillToRemove),
    });
  };

  const handleAddPreferredSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = prefSkillInput.trim();
    if (trimmed && !jobRequirement.preferredSkills.includes(trimmed)) {
      setJobRequirement({
        ...jobRequirement,
        preferredSkills: [...jobRequirement.preferredSkills, trimmed],
      });
      setPrefSkillInput('');
    }
  };

  const handleRemovePreferredSkill = (skillToRemove: string) => {
    setJobRequirement({
      ...jobRequirement,
      preferredSkills: jobRequirement.preferredSkills.filter(s => s !== skillToRemove),
    });
  };

  const handleApplyPreset = (preset: JobRequirement) => {
    setJobRequirement({ ...preset });
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2500);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#e6ebf1] shadow-2xs p-6 sm:p-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#e6ebf1] gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-0.5">Role Configuration</p>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-[#0a2540] text-blue-200 rounded-lg">
              <Briefcase className="w-4 h-4" />
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">Job Requirement Specification</h2>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Define role parameters and criteria for the deterministic scoring engine.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Presets:</span>
          {DEFAULT_JOB_REQUIREMENTS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleApplyPreset(preset)}
              className={`px-3 py-1 text-xs rounded-full font-medium border transition-colors ${
                jobRequirement.jobTitle === preset.jobTitle
                  ? 'bg-[#0a2540] text-white border-[#0a2540] shadow-2xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {preset.jobTitle.split(' ')[0]} {preset.jobTitle.split(' ')[1] || ''}
            </button>
          ))}
        </div>
      </div>

      {savedFeedback && (
        <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm rounded-xl flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Preset role requirements applied successfully!</span>
        </div>
      )}

      {/* Form Grid */}
      <div className="mt-6 space-y-6">
        
        {/* Row 1: Job Title & Min Experience */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Job Title <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="input-job-title"
                type="text"
                value={jobRequirement.jobTitle}
                onChange={(e) => setJobRequirement({ ...jobRequirement, jobTitle: e.target.value })}
                placeholder="e.g. Python Developer"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Min. Experience (Years) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="input-min-experience"
                type="number"
                min="0"
                max="25"
                step="0.5"
                value={jobRequirement.minExperienceYears}
                onChange={(e) =>
                  setJobRequirement({
                    ...jobRequirement,
                    minExperienceYears: Math.max(0, parseFloat(e.target.value) || 0),
                  })
                }
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-medium"
              />
            </div>
          </div>
        </div>

        {/* Row 2: Minimum Education */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Minimum Education Qualification <span className="text-red-500">*</span>
          </label>
          <input
            id="input-min-education"
            type="text"
            value={jobRequirement.minEducation}
            onChange={(e) => setJobRequirement({ ...jobRequirement, minEducation: e.target.value })}
            placeholder="e.g. B.Tech / B.E / MCA / Computer Science Degree"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
          />
        </div>

        {/* Row 3: Required Skills (Weight 40%) */}
        <div className="p-5 bg-blue-50/40 rounded-2xl border border-blue-100">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center">
              <span>Required Skills (Mandatory)</span>
              <span className="ml-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900">
                40% Scoring Weight
              </span>
            </label>
            <span className="text-xs text-slate-500">{jobRequirement.requiredSkills.length} skills listed</span>
          </div>

          {/* Skill Tag Pills */}
          <div className="flex flex-wrap gap-2 mb-3 min-h-[38px] p-2.5 bg-white rounded-xl border border-slate-200">
            {jobRequirement.requiredSkills.length === 0 ? (
              <span className="text-xs text-slate-400 italic py-1">No mandatory skills added yet. Add below.</span>
            ) : (
              jobRequirement.requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#0a2540] text-white shadow-2xs group"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveRequiredSkill(skill)}
                    className="ml-1.5 p-0.5 hover:bg-blue-800 rounded-full text-blue-200 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            )}
          </div>

          {/* Add Skill Form */}
          <div className="flex gap-2">
            <input
              type="text"
              value={reqSkillInput}
              onChange={(e) => setReqSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddRequiredSkill(e)}
              placeholder="e.g. Python, SQL, Django, Machine Learning (press Enter)"
              className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
            <button
              type="button"
              id="btn-add-required-skill"
              onClick={() => handleAddRequiredSkill()}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-full shadow-2xs transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </button>
          </div>
        </div>

        {/* Row 4: Preferred Skills (Bonus) */}
        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center">
              <span>Preferred / Secondary Skills</span>
              <span className="ml-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                Bonus Criteria
              </span>
            </label>
            <span className="text-xs text-slate-500">{jobRequirement.preferredSkills.length} skills listed</span>
          </div>

          {/* Skill Tag Pills */}
          <div className="flex flex-wrap gap-2 mb-3 min-h-[38px] p-2.5 bg-white rounded-xl border border-slate-200">
            {jobRequirement.preferredSkills.length === 0 ? (
              <span className="text-xs text-slate-400 italic py-1">No preferred skills. Add below if desired.</span>
            ) : (
              jobRequirement.preferredSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-700 text-white shadow-2xs"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemovePreferredSkill(skill)}
                    className="ml-1.5 p-0.5 hover:bg-slate-800 rounded-full text-slate-300 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            )}
          </div>

          {/* Add Preferred Skill */}
          <div className="flex gap-2">
            <input
              type="text"
              value={prefSkillInput}
              onChange={(e) => setPrefSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddPreferredSkill(e)}
              placeholder="e.g. Flask, FastAPI, Git, Docker (press Enter)"
              className="flex-1 px-4 py-2 bg-white border border-slate-200 rounded-full text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
            <button
              type="button"
              id="btn-add-preferred-skill"
              onClick={() => handleAddPreferredSkill()}
              className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs sm:text-sm font-semibold rounded-full shadow-2xs transition-colors flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </button>
          </div>
        </div>

        {/* Row 5: Detailed Job Description (Weight 20%) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Job Description & Responsibilities <span className="text-red-500">*</span>
            </label>
            <span className="text-xs text-slate-400">
              {jobRequirement.jobDescription.length} characters
            </span>
          </div>
          <textarea
            id="input-job-description"
            rows={5}
            value={jobRequirement.jobDescription}
            onChange={(e) => setJobRequirement({ ...jobRequirement, jobDescription: e.target.value })}
            placeholder="Enter full job description, role responsibilities, key domains, tech stack details..."
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all leading-relaxed"
          />
        </div>

      </div>

      {/* Footer / Proceed Action */}
      <div className="mt-8 pt-6 border-t border-[#e6ebf1] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-500 flex items-center font-sans">
          <Sparkles className="w-3.5 h-3.5 text-blue-600 mr-1.5" />
          Criteria will be evaluated deterministically across all uploaded resumes.
        </div>

        <button
          id="btn-save-job-proceed"
          onClick={onProceedToUpload}
          className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3 bg-[#0a2540] hover:bg-[#123659] active:bg-[#07192b] text-white font-semibold text-xs sm:text-sm rounded-full shadow-2xs transition-all"
        >
          <span>Save & Proceed to Resume Upload</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>

    </div>
  );
};
