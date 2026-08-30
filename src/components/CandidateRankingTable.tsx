import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Download, 
  Eye, 
  Check, 
  X, 
  Award, 
  Sparkles, 
  ChevronRight, 
  Mail, 
  Briefcase, 
  GraduationCap, 
  FileText
} from 'lucide-react';
import { CandidateAnalysis, RecommendationType } from '../types';

interface CandidateRankingTableProps {
  candidates: CandidateAnalysis[];
  onSelectCandidate: (candidate: CandidateAnalysis) => void;
  onExportCSV: () => void;
}

export const CandidateRankingTable: React.FC<CandidateRankingTableProps> = ({
  candidates,
  onSelectCandidate,
  onExportCSV,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [minScoreFilter, setMinScoreFilter] = useState(0);
  const [recommendationFilter, setRecommendationFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'score' | 'experience' | 'name' | 'skillsMatch'>('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter and sort candidates
  const filteredCandidates = useMemo(() => {
    let result = [...candidates];

    // Search query filter (matches name, email, or skills)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.candidateName.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.skills.some((s) => s.toLowerCase().includes(q)) ||
          c.matchingSkills.some((s) => s.toLowerCase().includes(q))
      );
    }

    // Min score filter
    if (minScoreFilter > 0) {
      result = result.filter((c) => c.matchScore >= minScoreFilter);
    }

    // Recommendation filter
    if (recommendationFilter !== 'All') {
      result = result.filter((c) => c.recommendation === recommendationFilter);
    }

    // Sorting
    result.sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'score') {
        comparison = b.matchScore - a.matchScore;
      } else if (sortBy === 'experience') {
        comparison = b.yearsOfExperience - a.yearsOfExperience;
      } else if (sortBy === 'skillsMatch') {
        comparison = b.skillsMatchPercentage - a.skillsMatchPercentage;
      } else if (sortBy === 'name') {
        comparison = a.candidateName.localeCompare(b.candidateName);
      }
      return sortOrder === 'asc' ? -comparison : comparison;
    });

    return result;
  }, [candidates, searchQuery, minScoreFilter, recommendationFilter, sortBy, sortOrder]);

  const getRecommendationBadge = (rec: RecommendationType) => {
    switch (rec) {
      case 'Strong Match':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
            Strong Match
          </span>
        );
      case 'Good Match':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5" />
            Good Match
          </span>
        );
      case 'Moderate Match':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
            Moderate Match
          </span>
        );
      case 'Low Match':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5" />
            Low Match
          </span>
        );
    }
  };

  const getRankMedal = (rank: number) => {
    if (rank === 1) {
      return (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-100/80 text-amber-900 border border-amber-300 font-serif font-bold text-xs shadow-2xs">
          01
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-200/80 text-slate-800 border border-slate-300 font-serif font-bold text-xs shadow-2xs">
          02
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-orange-100/70 text-orange-900 border border-orange-200 font-serif font-bold text-xs shadow-2xs">
          03
        </span>
      );
    }
    return (
      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-slate-500 font-serif font-bold text-xs">
        {String(rank).padStart(2, '0')}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-[#e6ebf1] shadow-2xs overflow-hidden">
      
      {/* Header & Title */}
      <div className="p-6 border-b border-[#e6ebf1]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-0.5">Evaluation Leaderboard</p>
            <h2 className="text-xl font-serif font-bold text-slate-900 flex items-center">
              <Award className="w-5 h-5 mr-2 text-blue-600" />
              Ranked Candidates
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Deterministic weighted evaluation: Skills 40%, Experience 25%, Education 15%, Job Description 20%
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              id="btn-export-table-csv"
              onClick={onExportCSV}
              disabled={candidates.length === 0}
              className="inline-flex items-center px-5 py-2 bg-[#0a2540] hover:bg-[#123659] disabled:opacity-40 text-white text-xs font-semibold rounded-full transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Export Ranking (CSV)
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              id="input-candidate-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or skill..."
              className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          {/* Recommendation Filter */}
          <div>
            <select
              id="select-recommendation-filter"
              value={recommendationFilter}
              onChange={(e) => setRecommendationFilter(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium"
            >
              <option value="All">All Recommendations</option>
              <option value="Strong Match">Strong Match (≥80%)</option>
              <option value="Good Match">Good Match (65-79%)</option>
              <option value="Moderate Match">Moderate Match (50-64%)</option>
              <option value="Low Match">Low Match (&lt;50%)</option>
            </select>
          </div>

          {/* Min Score Slider */}
          <div className="flex flex-col justify-center px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-2xl">
            <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Min Score:</span>
              <span className="text-blue-700 font-serif font-bold">{minScoreFilter}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={minScoreFilter}
              onChange={(e) => setMinScoreFilter(parseInt(e.target.value))}
              className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1.5">
            <select
              id="select-sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-medium"
            >
              <option value="score">Sort by: Match Score</option>
              <option value="experience">Sort by: Experience</option>
              <option value="skillsMatch">Sort by: Required Skills %</option>
              <option value="name">Sort by: Candidate Name</option>
            </select>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              title={`Toggle sort order (${sortOrder.toUpperCase()})`}
              className="p-2.5 bg-slate-50 border border-slate-200 rounded-full hover:bg-slate-100 text-slate-600"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* Candidates List / Table */}
      {filteredCandidates.length === 0 ? (
        <div className="p-12 text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No matching candidates found</h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria, clearing the minimum score filter, or uploading more resumes.
          </p>
          {(searchQuery || minScoreFilter > 0 || recommendationFilter !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setMinScoreFilter(0);
                setRecommendationFilter('All');
              }}
              className="mt-4 px-4 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg hover:bg-blue-100 transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/90 text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] border-b border-[#e6ebf1]">
                <th className="py-4 px-4 text-center w-16">Rank</th>
                <th className="py-4 px-4">Candidate</th>
                <th className="py-4 px-4">Skills Match Analysis</th>
                <th className="py-4 px-4">Experience & Edu</th>
                <th className="py-4 px-4 text-center">Score</th>
                <th className="py-4 px-4 text-center">Recommendation</th>
                <th className="py-4 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e6ebf1] text-sm">
              {filteredCandidates.map((cand, idx) => (
                <tr
                  key={cand.id}
                  onClick={() => onSelectCandidate(cand)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                >
                  {/* Rank Column */}
                  <td className="py-4 px-4 text-center align-top">
                    {getRankMedal(idx + 1)}
                  </td>

                  {/* Candidate Info */}
                  <td className="py-4 px-4 align-top">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-[#0a2540] text-white flex items-center justify-center font-serif font-bold text-xs shrink-0 mt-0.5 shadow-2xs">
                        {cand.candidateName === 'Name not clearly detected' ? '?' : (cand.candidateName.charAt(0) || 'C')}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`font-serif font-bold group-hover:text-blue-700 transition-colors text-base ${
                            cand.candidateName === 'Name not clearly detected' ? 'text-slate-500 italic' : 'text-slate-900'
                          }`}>
                            {cand.candidateName}
                          </span>
                          {cand.isDemo && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                              DEMO DATA
                            </span>
                          )}
                        </div>
                        <div className="flex items-center text-xs text-slate-500 mt-0.5 space-x-2">
                          <span className="truncate max-w-[180px]">{cand.email}</span>
                          {cand.phone !== 'Not found' && <span>• {cand.phone}</span>}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Skills Match Column */}
                  <td className="py-4 px-4 align-top">
                    <div className="space-y-1.5 max-w-xs">
                      {/* Skill Tags */}
                      <div className="flex flex-wrap gap-1">
                        {cand.matchingSkills.slice(0, 4).map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80"
                          >
                            <Check className="w-2.5 h-2.5 mr-1 text-emerald-600" />
                            {skill}
                          </span>
                        ))}
                        {cand.missingSkills.slice(0, 2).map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-red-50 text-red-700 border border-red-200/80"
                          >
                            <X className="w-2.5 h-2.5 mr-1 text-red-500" />
                            {skill}
                          </span>
                        ))}
                        {cand.matchingSkills.length + cand.missingSkills.length > 6 && (
                          <span className="text-[10px] text-slate-400 font-medium py-0.5">
                            +{cand.matchingSkills.length + cand.missingSkills.length - 6} more
                          </span>
                        )}
                      </div>

                      {/* Match percentage */}
                      <div className="text-[11px] text-slate-500 flex items-center space-x-2">
                        <span>Required Skills: <strong className="text-slate-800">{cand.skillsMatchPercentage}%</strong></span>
                      </div>
                    </div>
                  </td>

                  {/* Experience & Education */}
                  <td className="py-4 px-4 align-top text-xs text-slate-600">
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <Briefcase className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
                        <strong className="text-slate-900">{cand.yearsOfExperience} yr(s) exp</strong>
                      </div>
                      <div className="flex items-center">
                        <GraduationCap className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-[160px]" title={cand.education}>
                          {cand.education}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Match Score Indicator */}
                  <td className="py-4 px-4 align-top text-center">
                    <div className="inline-flex flex-col items-center">
                      <span className="text-lg font-serif font-bold text-slate-900 tracking-tight">
                        {cand.matchScore}%
                      </span>
                      <div className="w-14 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                        <div
                          className={`h-full rounded-full ${
                            cand.matchScore >= 80
                              ? 'bg-emerald-500'
                              : cand.matchScore >= 65
                              ? 'bg-blue-600'
                              : cand.matchScore >= 50
                              ? 'bg-amber-500'
                              : 'bg-slate-400'
                          }`}
                          style={{ width: `${cand.matchScore}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Recommendation Badge */}
                  <td className="py-4 px-4 align-top text-center">
                    {getRecommendationBadge(cand.recommendation)}
                  </td>

                  {/* View Details Button */}
                  <td className="py-4 px-4 align-top text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCandidate(cand);
                      }}
                      className="inline-flex items-center px-3.5 py-1.5 bg-slate-100 hover:bg-[#0a2540] hover:text-white text-slate-700 text-xs font-semibold rounded-full transition-colors border border-slate-200"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer Info */}
      <div className="p-4 bg-slate-50 border-t border-[#e6ebf1] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 font-sans">
        <span>Showing {filteredCandidates.length} of {candidates.length} candidates</span>
        <span className="italic">Click any candidate profile to inspect dimensional analysis & rationale.</span>
      </div>

    </div>
  );
};
