import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Layers, 
  Zap, 
  FileText, 
  Users, 
  TrendingUp, 
  Play
} from 'lucide-react';
import { JobRequirement } from '../types';

interface LandingHeroProps {
  currentJob: JobRequirement;
  candidateCount: number;
  onGetStarted: () => void;
  onLoadDemo: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  currentJob,
  candidateCount,
  onGetStarted,
  onLoadDemo,
}) => {
  return (
    <section className="relative overflow-hidden bg-[#fdfdfd] border-b border-[#e6ebf1] py-10 sm:py-14">
      {/* Background Subtle Editorial Grid / Dot pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#0a254008_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          
          {/* Editorial Eyebrow */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-900 text-xs font-bold uppercase tracking-[0.2em] mb-5 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Merit-First Recruitment Intelligence</span>
          </div>

          {/* Title & Subtitle */}
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-slate-900 tracking-tight leading-tight">
            AI Resume Screening System
          </h1>
          <p className="mt-3 text-lg sm:text-xl font-serif italic text-blue-800">
            Screen, Analyze and Rank Candidates with Precision
          </p>
          <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-sans">
            Upload multiple PDF & DOCX resumes, customize job criteria, extract technical competencies, and receive transparent, bias-free candidate rankings powered by Gemini 3.7 AI.
          </p>

          {/* Call to Actions */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3.5">
            <button
              id="btn-hero-get-started"
              onClick={onGetStarted}
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 shadow-sm transition-all transform hover:-translate-y-0.5"
            >
              <span>Define Job Criteria</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>

            <button
              id="btn-hero-demo-mode"
              onClick={onLoadDemo}
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-sm font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100 shadow-2xs transition-all"
            >
              <Play className="w-3.5 h-3.5 mr-2 text-blue-600 fill-blue-600" />
              <span>Explore Demo Candidates</span>
            </button>
          </div>

          {/* Key Feature Pills */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            <div className="bg-white p-4 rounded-xl border-l-4 border-blue-600 border border-slate-200 shadow-2xs">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-0.5">Format Engine</p>
              <h2 className="text-sm font-serif font-bold text-slate-800">PDF & DOCX Parsing</h2>
            </div>

            <div className="bg-white p-4 rounded-xl border-l-4 border-emerald-500 border border-slate-200 shadow-2xs">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-0.5">Weighted Math</p>
              <h2 className="text-sm font-serif font-bold text-slate-800">40/25/15/20 Formula</h2>
            </div>

            <div className="bg-white p-4 rounded-xl border-l-4 border-amber-500 border border-slate-200 shadow-2xs">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-0.5">Ethical Screening</p>
              <h2 className="text-sm font-serif font-bold text-slate-800">Protected Bias Shield</h2>
            </div>

            <div className="bg-white p-4 rounded-xl border-l-4 border-[#0a2540] border border-slate-200 shadow-2xs">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-0.5">Leaderboard</p>
              <h2 className="text-sm font-serif font-bold text-slate-800">Rankings & CSV Export</h2>
            </div>
          </div>

          {/* Active Job context bar */}
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#e6ebf1] shadow-2xs text-xs text-slate-600">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Active Role:</span>
            <span className="font-serif font-bold text-slate-900 text-sm">{currentJob.jobTitle}</span>
            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-widest rounded-full border border-emerald-200">
              Active Screening
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="hidden sm:inline">Min Exp: <strong className="text-slate-800">{currentJob.minExperienceYears} yr(s)</strong></span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="hidden sm:inline">Skills: <strong className="text-slate-800">{currentJob.requiredSkills.slice(0, 3).join(', ')}</strong></span>
          </div>

        </div>
      </div>
    </section>
  );
};
