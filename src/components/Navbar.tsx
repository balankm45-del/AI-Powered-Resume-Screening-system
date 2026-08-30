import React from 'react';
import { 
  FileCheck2, 
  Sparkles, 
  RotateCcw, 
  Download, 
  ShieldCheck, 
  Briefcase, 
  UploadCloud, 
  BarChart3,
  Award
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'dashboard' | 'job' | 'upload' | 'safety';
  setActiveTab: (tab: 'dashboard' | 'job' | 'upload' | 'safety') => void;
  candidateCount: number;
  onLoadDemoData: () => void;
  onReset: () => void;
  onExportCSV: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  candidateCount,
  onLoadDemoData,
  onReset,
  onExportCSV,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0a2540] text-white border-b border-[#1e3a5a] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-2">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-[#1e3a5a] border border-blue-400/30 flex items-center justify-center text-blue-300 shadow-inner">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] tracking-[0.2em] font-bold uppercase text-blue-300/80">INTELLIGENCE</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/20 text-blue-200 border border-blue-400/30">
                  <Sparkles className="w-2.5 h-2.5 mr-1 text-blue-300" />
                  Gemini 3.7
                </span>
              </div>
              <div className="text-xl font-serif italic font-medium tracking-tight text-white flex items-baseline space-x-1.5">
                <span>Screen.AI</span>
                <span className="text-xs font-sans not-italic text-slate-300 font-normal hidden sm:inline">— Resume Screener</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 bg-[#06182a] p-1 rounded-xl border border-white/10 text-sm font-medium">
            <button
              id="nav-tab-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-[#1e3a5a] text-white shadow-xs font-semibold border border-blue-400/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <BarChart3 className="w-4 h-4 mr-2 text-blue-300" />
              Candidate Ranking
              {candidateCount > 0 && (
                <span className="ml-2 bg-blue-500/30 border border-blue-400/30 text-blue-200 text-xs px-2 py-0.2 rounded-full font-bold">
                  {candidateCount}
                </span>
              )}
            </button>

            <button
              id="nav-tab-job"
              onClick={() => setActiveTab('job')}
              className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                activeTab === 'job'
                  ? 'bg-[#1e3a5a] text-white shadow-xs font-semibold border border-blue-400/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Briefcase className="w-4 h-4 mr-2 text-blue-300" />
              Job Criteria
            </button>

            <button
              id="nav-tab-upload"
              onClick={() => setActiveTab('upload')}
              className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                activeTab === 'upload'
                  ? 'bg-[#1e3a5a] text-white shadow-xs font-semibold border border-blue-400/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <UploadCloud className="w-4 h-4 mr-2 text-blue-300" />
              Upload Resumes
            </button>

            <button
              id="nav-tab-safety"
              onClick={() => setActiveTab('safety')}
              className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                activeTab === 'safety'
                  ? 'bg-[#1e3a5a] text-white shadow-xs font-semibold border border-blue-400/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldCheck className="w-4 h-4 mr-2 text-emerald-400" />
              Ethical AI
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2.5">
            <button
              id="btn-demo-load"
              onClick={onLoadDemoData}
              title="Load sample candidates (Arun, Priya, Rahul)"
              className="inline-flex items-center px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-full text-blue-200 bg-blue-500/20 border border-blue-400/40 hover:bg-blue-500/30 transition-colors shadow-2xs"
            >
              <Award className="w-3.5 h-3.5 mr-1.5 text-blue-300" />
              <span className="hidden xs:inline">Load</span> Demo Data
            </button>

            {candidateCount > 0 && (
              <button
                id="btn-export-csv"
                onClick={onExportCSV}
                title="Export ranked candidates as CSV"
                className="hidden sm:inline-flex items-center px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Export CSV
              </button>
            )}

            <button
              id="btn-reset-data"
              onClick={onReset}
              title="Clear all uploaded data"
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden overflow-x-auto py-2.5 border-t border-white/10 space-x-2 scrollbar-none">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3.5 py-1 text-xs rounded-full whitespace-nowrap font-medium ${
              activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-white/10 text-slate-300'
            }`}
          >
            Rankings ({candidateCount})
          </button>
          <button
            onClick={() => setActiveTab('job')}
            className={`px-3.5 py-1 text-xs rounded-full whitespace-nowrap font-medium ${
              activeTab === 'job' ? 'bg-blue-600 text-white' : 'bg-white/10 text-slate-300'
            }`}
          >
            Job Specs
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-3.5 py-1 text-xs rounded-full whitespace-nowrap font-medium ${
              activeTab === 'upload' ? 'bg-blue-600 text-white' : 'bg-white/10 text-slate-300'
            }`}
          >
            Upload Resumes
          </button>
          <button
            onClick={() => setActiveTab('safety')}
            className={`px-3.5 py-1 text-xs rounded-full whitespace-nowrap font-medium ${
              activeTab === 'safety' ? 'bg-blue-600 text-white' : 'bg-white/10 text-slate-300'
            }`}
          >
            AI Fairness
          </button>
        </div>

      </div>
    </header>
  );
};
