import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Lock, 
  HeartHandshake, 
  Scale, 
  Award, 
  Cpu
} from 'lucide-react';

export const AiSafetyNotice: React.FC = () => {
  return (
    <div className="space-y-6">
      
      {/* Hero card */}
      <div className="bg-[#0a2540] text-white rounded-3xl p-6 sm:p-8 shadow-2xs relative overflow-hidden border border-[#1e3a5a]">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>AI Fairness & Anti-Bias Protocol</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white">
            Ethical, Merit-First AI Resume Screening
          </h2>
          <p className="mt-3 text-sm text-blue-100/90 leading-relaxed font-sans">
            Our screening pipeline is engineered to eliminate systemic hiring biases by enforcing strict system-level prompt constraints and automated filtering of protected personal characteristics.
          </p>
        </div>
      </div>

      {/* Comparison Grid: What AI Evaluates vs What Is Forbidden */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Strictly Forbidden Personal Attributes */}
        <div className="bg-white rounded-2xl border-l-4 border-red-500 border border-slate-200 p-6 shadow-2xs">
          <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-red-100">
            <div className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center font-bold">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-red-500">Excluded Attributes</p>
              <h3 className="font-serif font-bold text-slate-900 text-lg">Protected Characteristics</h3>
            </div>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-700">
            <li className="flex items-center space-x-2 p-2.5 bg-red-50/40 rounded-xl border border-red-100/60">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              <span><strong>Gender & Gender Identity</strong> — Completely ignored in candidate evaluation</span>
            </li>
            <li className="flex items-center space-x-2 p-2.5 bg-red-50/40 rounded-xl border border-red-100/60">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              <span><strong>Age & Date of Birth</strong> — Scoring strictly depends on professional years</span>
            </li>
            <li className="flex items-center space-x-2 p-2.5 bg-red-50/40 rounded-xl border border-red-100/60">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              <span><strong>Religion, Caste, Race & Nationality</strong> — Zero scoring weight</span>
            </li>
            <li className="flex items-center space-x-2 p-2.5 bg-red-50/40 rounded-xl border border-red-100/60">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              <span><strong>Marital & Family Status</strong> — Excluded from prompt and scoring rules</span>
            </li>
            <li className="flex items-center space-x-2 p-2.5 bg-red-50/40 rounded-xl border border-red-100/60">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              <span><strong>Photographs & Physical Appearance</strong> — Non-evaluative</span>
            </li>
            <li className="flex items-center space-x-2 p-2.5 bg-red-50/40 rounded-xl border border-red-100/60">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              <span><strong>Disability & Medical Details</strong> — Strictly excluded</span>
            </li>
          </ul>
        </div>

        {/* What AI Evaluates */}
        <div className="bg-white rounded-2xl border-l-4 border-emerald-500 border border-slate-200 p-6 shadow-2xs">
          <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-emerald-100">
            <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-600">Weighted Factors</p>
              <h3 className="font-serif font-bold text-slate-900 text-lg">Merit-Based Criteria</h3>
            </div>
          </div>

          <ul className="space-y-2.5 text-xs text-slate-700">
            <li className="flex items-center space-x-2 p-2.5 bg-emerald-50/40 rounded-xl border border-emerald-100/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span><strong>Technical & Professional Skills (40%)</strong> — Match against required tech stack</span>
            </li>
            <li className="flex items-center space-x-2 p-2.5 bg-emerald-50/40 rounded-xl border border-emerald-100/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span><strong>Relevant Work Experience (25%)</strong> — Years and depth in related domains</span>
            </li>
            <li className="flex items-center space-x-2 p-2.5 bg-emerald-50/40 rounded-xl border border-emerald-100/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span><strong>Educational Qualification (15%)</strong> — Degree and academic discipline match</span>
            </li>
            <li className="flex items-center space-x-2 p-2.5 bg-emerald-50/40 rounded-xl border border-emerald-100/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span><strong>Job Description Alignment (20%)</strong> — Contextual role and project synergy</span>
            </li>
            <li className="flex items-center space-x-2 p-2.5 bg-emerald-50/40 rounded-xl border border-emerald-100/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span><strong>Projects & Practical Output</strong> — Demonstration of core competencies</span>
            </li>
            <li className="flex items-center space-x-2 p-2.5 bg-emerald-50/40 rounded-xl border border-emerald-100/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span><strong>Industry Certifications</strong> — Verified credentials & continuous learning</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Human In the Loop Policy */}
      <div className="bg-white rounded-2xl border-l-4 border-[#0a2540] border border-slate-200 p-6 shadow-2xs">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">Governance Standard</p>
        <h3 className="text-lg font-serif font-bold text-slate-900 flex items-center mb-2">
          <HeartHandshake className="w-5 h-5 mr-2 text-blue-600" />
          Responsible AI & Recruiter Autonomy
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          AI-generated screening is designed strictly as an assistive tool to accelerate resume triage, reduce human fatigue, and provide explainable ranking insights. It never issues automatic rejections or autonomous hiring decisions. Final decisions must always be made by a qualified human recruiter or hiring manager.
        </p>

        <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-serif italic">
          “AI-generated screening is an assistive tool. Final hiring decisions must always be made by a qualified human recruiter.”
        </div>
      </div>

    </div>
  );
};
