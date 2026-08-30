import React, { useRef, useState } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Trash2, 
  AlertCircle, 
  Sparkles, 
  CheckCircle, 
  Loader2, 
  FileCheck, 
  Play, 
  Plus,
  ArrowRight,
  FileSpreadsheet
} from 'lucide-react';
import { UploadedFileItem, JobRequirement } from '../types';

interface ResumeUploadZoneProps {
  files: UploadedFileItem[];
  setFiles: React.Dispatch<React.SetStateAction<UploadedFileItem[]>>;
  isAnalyzing: boolean;
  analysisProgress: number; // 0 - 100
  analysisStatusText: string;
  onAnalyzeResumes: () => void;
  onLoadDemoData: () => void;
  jobRequirement: JobRequirement;
}

export const ResumeUploadZone: React.FC<ResumeUploadZoneProps> = ({
  files,
  setFiles,
  isAnalyzing,
  analysisProgress,
  analysisStatusText,
  onAnalyzeResumes,
  onLoadDemoData,
  jobRequirement,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleFilesAdded = (incomingFiles: FileList | null) => {
    if (!incomingFiles || incomingFiles.length === 0) return;
    setValidationError(null);

    const validExtensions = ['.pdf', '.docx', '.txt', '.doc'];
    const newItems: UploadedFileItem[] = [];
    const rejected: string[] = [];

    Array.from(incomingFiles).forEach((file) => {
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!validExtensions.includes(ext)) {
        rejected.push(file.name);
        return;
      }

      // Check for duplicates
      const exists = files.some((f) => f.name === file.name && f.size === file.size);
      if (!exists) {
        newItems.push({
          id: 'file-' + Math.random().toString(36).substring(2, 9),
          file,
          name: file.name,
          size: file.size,
          type: file.type || ext,
          status: 'pending',
        });
      }
    });

    if (rejected.length > 0) {
      setValidationError(`Unsupported file types (${rejected.join(', ')}). Please upload PDF, DOCX, or TXT documents.`);
    }

    if (newItems.length > 0) {
      setFiles((prev) => [...prev, ...newItems]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFilesAdded(e.dataTransfer.files);
  };

  const handleRemoveFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleClearAll = () => {
    setFiles([]);
    setValidationError(null);
  };

  // Helper to create synthetic dummy sample resumes if recruiter wants to test file uploading
  const handleAddSampleFiles = () => {
    const sample1 = new File(
      [
        `Arun Kumar\nEmail: arun.kumar.dev@example.com\nPhone: +91 98765 43210\nEducation: B.Tech Computer Science (CGPA 8.6)\nExperience: 2 years in Python backend development with Django, FastAPI, SQL database queries, and Machine Learning predictive model integration.\nProjects: Built AI Resume Ranker with Django and SQL; E-commerce price predictor with ML.\nCertifications: Python for ML, AWS Cloud.`
      ],
      'Arun_Kumar_Resume.txt',
      { type: 'text/plain' }
    );

    const sample2 = new File(
      [
        `Priya Sharma\nEmail: priya.sharma99@example.com\nPhone: +91 98123 45678\nEducation: MCA Master of Computer Applications\nExperience: 1 year building Python web applications using Flask, MySQL and SQL database schemas.\nProjects: Hospital management system with Flask, analytics dashboard.\nSkills: Python, SQL, Flask, Git, MySQL.`
      ],
      'Priya_Sharma_Resume.txt',
      { type: 'text/plain' }
    );

    const sample3 = new File(
      [
        `Rahul Verma\nEmail: rahul.v@example.com\nPhone: +91 97654 32198\nEducation: B.Sc IT\nExperience: 1 year web development in Java, HTML, CSS, JavaScript, Basic SQL queries.\nSkills: Java, HTML, CSS, JavaScript, SQL.`
      ],
      'Rahul_Verma_Resume.txt',
      { type: 'text/plain' }
    );

    const syntheticItems: UploadedFileItem[] = [
      { id: 'synth-1', file: sample1, name: sample1.name, size: sample1.size, type: 'text/plain', status: 'pending' },
      { id: 'synth-2', file: sample2, name: sample2.name, size: sample2.size, type: 'text/plain', status: 'pending' },
      { id: 'synth-3', file: sample3, name: sample3.name, size: sample3.size, type: 'text/plain', status: 'pending' },
    ];

    setFiles((prev) => [...prev, ...syntheticItems]);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#e6ebf1] shadow-2xs p-6 sm:p-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#e6ebf1] gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-0.5">Document Ingestion</p>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-[#0a2540] text-blue-200 rounded-lg">
              <UploadCloud className="w-4 h-4" />
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900">Upload Candidate Resumes</h2>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Target Job: <strong className="text-slate-900">{jobRequirement.jobTitle}</strong> ({jobRequirement.requiredSkills.join(', ')})
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleAddSampleFiles}
            className="px-4 py-2 text-xs font-semibold text-[#0a2540] bg-slate-100 border border-slate-200 rounded-full hover:bg-slate-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 inline mr-1" />
            Attach 3 Sample Files
          </button>
        </div>
      </div>

      {/* Validation alert */}
      {validationError && (
        <div className="mt-4 p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm rounded-2xl flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isAnalyzing && fileInputRef.current?.click()}
        className={`mt-6 border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all ${
          isDragOver
            ? 'border-blue-600 bg-blue-50/50 scale-[1.005]'
            : 'border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50'
        } ${isAnalyzing ? 'opacity-60 pointer-events-none' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.doc,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
          className="hidden"
          onChange={(e) => handleFilesAdded(e.target.files)}
        />

        <div className="mx-auto w-14 h-14 bg-white rounded-2xl shadow-2xs border border-slate-200 flex items-center justify-center text-[#0a2540] mb-4">
          <UploadCloud className="w-7 h-7" />
        </div>

        <h3 className="text-base font-serif font-bold text-slate-900">
          Click to upload or drag & drop resumes
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-md mx-auto font-sans">
          Supports multiple <strong className="text-slate-800">PDF, DOCX, and TXT</strong> documents up to 15MB each.
        </p>

        <div className="mt-4 inline-flex items-center space-x-2 text-[10px] font-bold uppercase tracking-wider text-blue-900 bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
          <span>Batch upload enabled</span>
        </div>
      </div>

      {/* Uploaded File Queue List */}
      {files.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center">
              <span>Selected Resumes ({files.length})</span>
            </h4>
            {!isAnalyzing && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs text-red-600 hover:text-red-700 font-semibold hover:underline"
              >
                Clear Queue
              </button>
            )}
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {files.map((item, idx) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-sm hover:bg-white hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-[#0a2540] text-blue-200 flex items-center justify-center font-bold text-xs shrink-0 uppercase">
                    {item.name.split('.').pop() || 'DOC'}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 truncate text-xs sm:text-sm">
                      {idx + 1}. {item.name}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {formatFileSize(item.size)} • Ready for AI screening
                    </p>
                  </div>
                </div>

                {!isAnalyzing && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile(item.id);
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove resume"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analyzing Progress Screen */}
      {isAnalyzing && (
        <div className="mt-6 p-6 bg-blue-50/60 border border-blue-200 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              <span className="font-serif font-bold text-slate-900 text-sm">{analysisStatusText}</span>
            </div>
            <span className="text-xs font-serif font-bold text-blue-800">{Math.round(analysisProgress)}%</span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-blue-200/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#0a2540] rounded-full transition-all duration-300 ease-out"
              style={{ width: `${analysisProgress}%` }}
            />
          </div>

          <p className="mt-3 text-xs text-slate-600 flex items-center font-sans">
            <Sparkles className="w-3.5 h-3.5 mr-1 text-blue-600" />
            Extracting candidate credentials, matching skills against role criteria, and computing fair rankings...
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-8 pt-6 border-t border-[#e6ebf1] flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="text-xs text-slate-500 font-sans">
          {files.length === 0 ? 'Upload resumes above or use Demo Data.' : `${files.length} resume(s) loaded in queue.`}
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {files.length === 0 && (
            <button
              type="button"
              id="btn-load-demo-upload-zone"
              onClick={onLoadDemoData}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold rounded-full transition-colors flex items-center justify-center border border-slate-200"
            >
              <Play className="w-3.5 h-3.5 mr-1.5 text-[#0a2540]" />
              Load Demo Candidates
            </button>
          )}

          <button
            type="button"
            id="btn-analyze-resumes"
            disabled={files.length === 0 || isAnalyzing}
            onClick={onAnalyzeResumes}
            className={`w-full sm:w-auto inline-flex items-center justify-center px-7 py-2.5 rounded-full text-xs sm:text-sm font-semibold shadow-2xs transition-all ${
              files.length === 0 || isAnalyzing
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-[#0a2540] hover:bg-[#123659] active:bg-[#07192b] text-white transform hover:-translate-y-0.5'
            }`}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span>Screening with AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2 text-blue-300" />
                <span>Analyze {files.length > 0 ? `(${files.length}) Resumes` : 'Resumes'}</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};
