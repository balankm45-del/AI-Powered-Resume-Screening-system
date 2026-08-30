import React from 'react';
import { 
  FileCheck2, 
  Users, 
  Award, 
  TrendingUp, 
  Percent, 
  CheckCircle2, 
  Sparkles,
  BarChart2
} from 'lucide-react';
import { CandidateAnalysis, AnalysisStats } from '../types';

interface DashboardStatsProps {
  stats: AnalysisStats;
  candidates: CandidateAnalysis[];
  onSelectCandidate: (candidate: CandidateAnalysis) => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  stats,
  candidates,
  onSelectCandidate,
}) => {
  return (
    <div className="space-y-6">
      
      {/* 4 Primary Stats Cards - Editorial Left-Border Aesthetic */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Total Resumes */}
        <div className="bg-white p-6 border-l-4 border-blue-600 border border-slate-200/80 shadow-2xs rounded-r-2xl relative overflow-hidden group hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Total Resumes</p>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight">
              {stats.totalResumes}
            </span>
            <span className="text-xs text-slate-400 font-medium">files</span>
          </div>
          <p className="mt-1 text-xs text-slate-500 font-sans">Processed in current workspace</p>
        </div>

        {/* Card 2: Candidates Analyzed */}
        <div className="bg-white p-6 border-l-4 border-[#0a2540] border border-slate-200/80 shadow-2xs rounded-r-2xl relative overflow-hidden group hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Screened Candidates</p>
            <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight">
              {stats.analyzedCount}
            </span>
            <span className="text-xs text-slate-400 font-medium">ranked</span>
          </div>
          <p className="mt-1 text-xs text-slate-500 font-sans">100% merit-based scoring</p>
        </div>

        {/* Card 3: Strong Matches */}
        <div className="bg-white p-6 border-l-4 border-emerald-500 border border-slate-200/80 shadow-2xs rounded-r-2xl relative overflow-hidden group hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Strong Matches</p>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl sm:text-4xl font-serif font-bold text-emerald-600 tracking-tight">
              {stats.strongMatches}
            </span>
            <span className="text-xs text-slate-400 font-medium">≥ 80% score</span>
          </div>
          <p className="mt-1 text-xs text-slate-500 font-sans">Immediate interview contenders</p>
        </div>

        {/* Card 4: Average Match Score */}
        <div className="bg-white p-6 border-l-4 border-amber-400 border border-slate-200/80 shadow-2xs rounded-r-2xl relative overflow-hidden group hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Avg Match Score</p>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight">
              {stats.averageScore}%
            </span>
            <span className="text-xs text-slate-400 font-medium">overall</span>
          </div>
          <p className="mt-1 text-xs text-slate-500 font-sans">Highest score: {stats.highestScore}%</p>
        </div>

      </div>

      {/* Visual Chart: Candidate Score Comparison Chart */}
      {candidates.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#e6ebf1] shadow-2xs p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#e6ebf1] gap-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-0.5">Performance Overview</p>
              <h3 className="text-lg font-serif font-bold text-slate-900 flex items-center">
                <BarChart2 className="w-4 h-4 mr-2 text-blue-600" />
                Candidate Score Comparison
              </h3>
            </div>
            
            {/* Legend */}
            <div className="flex items-center space-x-4 text-xs font-medium text-slate-600">
              <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-1.5" /> Strong (≥80)</span>
              <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-1.5" /> Good (65-79)</span>
              <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-1.5" /> Moderate (50-64)</span>
              <span className="flex items-center"><span className="w-2.5 h-2.5 rounded-full bg-slate-400 mr-1.5" /> Low (&lt;50)</span>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="mt-5 space-y-3.5">
            {candidates.map((cand, idx) => {
              const score = cand.matchScore;
              let barColor = 'bg-slate-400';
              let badgeColor = 'bg-slate-100 text-slate-700';

              if (score >= 80) {
                barColor = 'bg-emerald-500';
                badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
              } else if (score >= 65) {
                barColor = 'bg-blue-600';
                badgeColor = 'bg-blue-50 text-blue-800 border-blue-200';
              } else if (score >= 50) {
                barColor = 'bg-amber-500';
                badgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
              }

              return (
                <div
                  key={cand.id}
                  onClick={() => onSelectCandidate(cand)}
                  className="group cursor-pointer p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center space-x-2.5">
                      <span className="font-serif font-bold text-slate-400 text-xs w-6">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {cand.candidateName}
                      </span>
                      {cand.isDemo && (
                        <span className="px-1.5 py-0.2 bg-purple-50 text-purple-700 border border-purple-200 rounded text-[10px] font-bold">
                          DEMO DATA
                        </span>
                      )}
                      <span className="text-slate-400 hidden sm:inline">• {cand.yearsOfExperience} yrs exp</span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider border ${badgeColor}`}>
                        {cand.recommendation}
                      </span>
                      <span className="font-serif font-bold text-base text-slate-900 w-12 text-right">
                        {score}%
                      </span>
                    </div>
                  </div>

                  {/* Visual Bar */}
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ease-out ${barColor}`}
                      style={{ width: `${score}%` }}
                    />
                  </div>

                  {/* Component Breakdown Mini Bar */}
                  <div className="mt-1.5 flex items-center space-x-4 text-[10px] text-slate-400">
                    <span>Skills: <strong className="text-slate-700">{cand.breakdown.skillsScore}%</strong> (40%)</span>
                    <span>Exp: <strong className="text-slate-700">{cand.breakdown.experienceScore}%</strong> (25%)</span>
                    <span>Edu: <strong className="text-slate-700">{cand.breakdown.educationScore}%</strong> (15%)</span>
                    <span>Desc: <strong className="text-slate-700">{cand.breakdown.descriptionScore}%</strong> (20%)</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
};
