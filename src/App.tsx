/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  JobRequirement, 
  UploadedFileItem, 
  CandidateAnalysis, 
  AnalysisStats 
} from './types';
import { DEFAULT_JOB_REQUIREMENTS, DEMO_CANDIDATES } from './data/sampleData';
import { Navbar } from './components/Navbar';
import { LandingHero } from './components/LandingHero';
import { JobRequirementForm } from './components/JobRequirementForm';
import { ResumeUploadZone } from './components/ResumeUploadZone';
import { DashboardStats } from './components/DashboardStats';
import { CandidateRankingTable } from './components/CandidateRankingTable';
import { CandidateDetailModal } from './components/CandidateDetailModal';
import { AiSafetyNotice } from './components/AiSafetyNotice';
import { exportCandidatesToCSV } from './utils/exportCsv';
import { extractTextFromFile, analyzeResumeClientSide } from './utils/clientAnalyzer';
import { 
  AlertCircle, 
  CheckCircle2, 
  Briefcase, 
  UploadCloud, 
  Award, 
  ShieldCheck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function App() {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'job' | 'upload' | 'safety'>('dashboard');

  // Active Job Requirement
  const [jobRequirement, setJobRequirement] = useState<JobRequirement>(DEFAULT_JOB_REQUIREMENTS[0]);

  // Uploaded Files Queue
  const [files, setFiles] = useState<UploadedFileItem[]>([]);

  // Analyzed Candidates List (initially pre-populated with realistic demo candidates for instant evaluation)
  const [candidates, setCandidates] = useState<CandidateAnalysis[]>(DEMO_CANDIDATES);

  // Selected candidate for detail modal
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateAnalysis | null>(null);

  // Analysis status & progress
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStatusText, setAnalysisStatusText] = useState('Initializing screening engine...');
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>({
    type: 'info',
    message: 'Demo dataset loaded. You can enter new job criteria or upload custom resumes.',
  });

  // Calculate live statistics
  const stats: AnalysisStats = useMemo(() => {
    const totalResumes = files.length > 0 ? files.length : candidates.length;
    const analyzedCount = candidates.length;
    const strongMatches = candidates.filter((c) => c.matchScore >= 80).length;
    const goodMatches = candidates.filter((c) => c.matchScore >= 65 && c.matchScore < 80).length;
    const moderateMatches = candidates.filter((c) => c.matchScore >= 50 && c.matchScore < 65).length;
    const lowMatches = candidates.filter((c) => c.matchScore < 50).length;
    const totalScore = candidates.reduce((acc, c) => acc + c.matchScore, 0);
    const averageScore = analyzedCount > 0 ? Math.round(totalScore / analyzedCount) : 0;
    const highestScore = candidates.length > 0 ? Math.max(...candidates.map((c) => c.matchScore)) : 0;

    return {
      totalResumes,
      analyzedCount,
      strongMatches,
      goodMatches,
      moderateMatches,
      lowMatches,
      averageScore,
      highestScore,
    };
  }, [files, candidates]);

  // Handle Load Demo Data
  const handleLoadDemoData = () => {
    setJobRequirement(DEFAULT_JOB_REQUIREMENTS[0]);
    setCandidates([...DEMO_CANDIDATES]);
    setNotification({
      type: 'success',
      message: 'Demo candidates (Arun Kumar 92%, Priya Sharma 76%, Rahul Verma 46%) loaded successfully!',
    });
    setActiveTab('dashboard');
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch (_) {}
  };

  // Handle Reset workspace
  const handleReset = () => {
    setFiles([]);
    setCandidates([]);
    setNotification({
      type: 'info',
      message: 'Workspace cleared. Define job criteria and upload resumes to start screening.',
    });
  };

  // Handle Export CSV
  const handleExportCSV = () => {
    if (candidates.length === 0) return;
    exportCandidatesToCSV(candidates, jobRequirement);
    setNotification({
      type: 'success',
      message: 'Candidate rankings exported to CSV successfully.',
    });
  };

  // Analyze Resumes via API with graceful Client-side fallback
  const handleAnalyzeResumes = async () => {
    if (files.length === 0) {
      setNotification({ type: 'error', message: 'Please upload at least one resume file.' });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(10);
    setAnalysisStatusText('Preparing document buffers...');

    let progressInterval: any = null;

    try {
      setAnalysisProgress(25);
      setAnalysisStatusText('Extracting candidate credentials with Gemini AI...');

      progressInterval = setInterval(() => {
        setAnalysisProgress((prev) => {
          if (prev >= 85) return prev;
          return prev + 10;
        });
      }, 500);

      let analyzedList: CandidateAnalysis[] | null = null;

      // Try server-side endpoint first
      try {
        const formData = new FormData();
        files.forEach((f) => {
          formData.append('resumes', f.file);
        });
        formData.append('jobRequirement', JSON.stringify(jobRequirement));

        const response = await fetch('/api/analyze-resumes', {
          method: 'POST',
          body: formData,
        });

        const contentType = response.headers.get('content-type') || '';
        if (response.ok && contentType.includes('application/json')) {
          const data = await response.json();
          if (data && Array.isArray(data.candidates) && data.candidates.length > 0) {
            analyzedList = data.candidates;
          }
        }
      } catch (networkErr) {
        console.warn('Server endpoint communication fallback triggered:', networkErr);
      }

      // If server response wasn't valid JSON or server unavailable, fallback to client-side processing
      if (!analyzedList || analyzedList.length === 0) {
        setAnalysisStatusText('Evaluating resumes with deterministic scoring engine...');
        const clientResults: CandidateAnalysis[] = [];

        for (let i = 0; i < files.length; i++) {
          const fileItem = files[i];
          const text = await extractTextFromFile(fileItem.file);
          const analyzed = analyzeResumeClientSide(text, fileItem.name, fileItem.size, jobRequirement);
          clientResults.push(analyzed);
        }

        clientResults.sort((a, b) => b.matchScore - a.matchScore);
        analyzedList = clientResults;
      }

      if (progressInterval) clearInterval(progressInterval);
      setAnalysisProgress(100);
      setAnalysisStatusText('Ranking candidates leaderboard...');

      setCandidates(analyzedList);
      setNotification({
        type: 'success',
        message: `Successfully analyzed and ranked ${analyzedList.length} resume(s)!`,
      });
      setActiveTab('dashboard');

      // Confetti celebration if any strong match found
      if (analyzedList.some((c: CandidateAnalysis) => c.matchScore >= 80)) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err: any) {
      if (progressInterval) clearInterval(progressInterval);
      console.error('Analysis error:', err);
      setNotification({
        type: 'error',
        message: `Analysis error: ${err.message || 'Failed to process resume files.'}`,
      });
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(0);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        candidateCount={candidates.length}
        onLoadDemoData={handleLoadDemoData}
        onReset={handleReset}
        onExportCSV={handleExportCSV}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* Landing Hero Section */}
        <LandingHero
          currentJob={jobRequirement}
          candidateCount={candidates.length}
          onGetStarted={() => setActiveTab('job')}
          onLoadDemo={handleLoadDemoData}
        />

        {/* Global Notification Banner */}
        {notification && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
            <div
              className={`p-3.5 rounded-xl border text-xs sm:text-sm flex items-center justify-between shadow-2xs ${
                notification.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : notification.type === 'error'
                  ? 'bg-red-50 border-red-200 text-red-800'
                  : 'bg-blue-50 border-blue-200 text-blue-800'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                {notification.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : notification.type === 'error' ? (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                ) : (
                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                )}
                <span>{notification.message}</span>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="text-xs font-semibold hover:opacity-75 ml-3"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Tab Body */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {/* TAB 1: DASHBOARD & RANKING */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* Dashboard Metric Cards & Chart */}
              <DashboardStats
                stats={stats}
                candidates={candidates}
                onSelectCandidate={(c) => setSelectedCandidate(c)}
              />

              {/* Candidates Ranking Table */}
              <CandidateRankingTable
                candidates={candidates}
                onSelectCandidate={(c) => setSelectedCandidate(c)}
                onExportCSV={handleExportCSV}
              />

              {/* Quick Call to Action Bar */}
              <div className="bg-[#0a2540] border border-[#1e3a5a] rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-300 mb-0.5">Recruitment Workflow</p>
                  <h3 className="text-lg font-serif font-bold">Screening a New Job Role?</h3>
                  <p className="text-xs text-slate-300 mt-0.5 font-sans">
                    Update job parameters or upload batch resumes to compute instant deterministic match rankings.
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setActiveTab('job')}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-full border border-white/20 transition-colors"
                  >
                    Edit Job Criteria
                  </button>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="px-5 py-2 bg-white text-[#0a2540] hover:bg-slate-100 text-xs font-bold rounded-full shadow-2xs transition-colors"
                  >
                    Upload Resumes
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: JOB REQUIREMENTS SPECIFICATION */}
          {activeTab === 'job' && (
            <div className="animate-in fade-in duration-300">
              <JobRequirementForm
                jobRequirement={jobRequirement}
                setJobRequirement={setJobRequirement}
                onProceedToUpload={() => setActiveTab('upload')}
              />
            </div>
          )}

          {/* TAB 3: RESUME UPLOAD ZONE */}
          {activeTab === 'upload' && (
            <div className="animate-in fade-in duration-300">
              <ResumeUploadZone
                files={files}
                setFiles={setFiles}
                isAnalyzing={isAnalyzing}
                analysisProgress={analysisProgress}
                analysisStatusText={analysisStatusText}
                onAnalyzeResumes={handleAnalyzeResumes}
                onLoadDemoData={handleLoadDemoData}
                jobRequirement={jobRequirement}
              />
            </div>
          )}

          {/* TAB 4: AI FAIRNESS & SAFETY */}
          {activeTab === 'safety' && (
            <div className="animate-in fade-in duration-300">
              <AiSafetyNotice />
            </div>
          )}

        </div>

      </main>

      {/* Candidate Detailed Analysis Modal */}
      {selectedCandidate && (
        <CandidateDetailModal
          candidate={selectedCandidate}
          jobRequirement={jobRequirement}
          onClose={() => setSelectedCandidate(null)}
        />
      )}

      {/* Professional Footer */}
      <footer className="mt-auto bg-white border-t border-[#e6ebf1] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-serif font-bold text-slate-900">AI-Powered Resume Screening System</span>
            <span>•</span>
            <span>Gemini 3.7 Flash & 4-Factor Weighted Ranking</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActiveTab('safety')}
              className="hover:text-blue-600 transition-colors flex items-center font-medium"
            >
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              Anti-Bias Policy
            </button>
            <span className="text-slate-300">|</span>
            <span>Assistive Recruiter Tool</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
