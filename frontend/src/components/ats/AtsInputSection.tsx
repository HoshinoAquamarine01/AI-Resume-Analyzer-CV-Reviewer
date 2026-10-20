import React, { useState } from "react";
import { FileText, Briefcase, Loader2, RefreshCw, AlertCircle } from "lucide-react";

export interface ResumeOption {
  _id: string;
  title: string;
  fileType?: string;
  createdAt?: string;
}

interface AtsInputSectionProps {
  resumes: ResumeOption[];
  selectedResumeId: string;
  onSelectResume: (id: string) => void;
  jobDescription: string;
  onChangeJobDescription: (text: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  isLoadingResumes: boolean;
}

export const AtsInputSection: React.FC<AtsInputSectionProps> = ({
  resumes,
  selectedResumeId,
  onSelectResume,
  jobDescription,
  onChangeJobDescription,
  onAnalyze,
  isAnalyzing,
  isLoadingResumes,
}) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResumeId) {
      setErrorMsg("Please select a resume to analyze.");
      return;
    }
    if (!jobDescription.trim() || jobDescription.trim().length < 30) {
      setErrorMsg("Please enter a detailed job description (at least 30 characters).");
      return;
    }
    setErrorMsg(null);
    onAnalyze();
  };

  const handlePasteSample = () => {
    const sampleJd = `Senior Software Engineer (Full Stack)
Responsibilities:
- Build, optimize, and maintain scalable web applications using React, TypeScript, and Node.js (NestJS).
- Design robust RESTful APIs and integrate cloud databases like MongoDB and Redis.
- Collaborate with product managers and designers to deliver intuitive user interfaces.
- Perform code reviews, implement unit testing, and maintain CI/CD deployment pipelines.

Requirements:
- 3+ years of experience with React, TypeScript, and backend frameworks.
- Proficient with MongoDB, PostgreSQL, and Git version control.
- Experience with Docker, AWS/GCP, and ATS optimization is a strong plus.`;
    onChangeJobDescription(sampleJd);
    setErrorMsg(null);
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl">

      <div>
        <label className="block text-sm font-semibold text-slate-200 mb-2 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" />
            Select Your Resume
          </span>
          <span className="text-xs text-slate-400 font-normal">
            {resumes.length} {resumes.length === 1 ? "resume" : "resumes"} available
          </span>
        </label>

        {isLoadingResumes ? (
          <div className="flex items-center gap-2 p-3 bg-slate-800/40 rounded-xl text-slate-400 text-sm border border-slate-700/50">
            <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
            Loading your uploaded resumes...
          </div>
        ) : resumes.length === 0 ? (
          <div className="p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl text-slate-400 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span>No resumes found in your account. </span>
              <a href="/resumes" className="text-blue-400 hover:underline font-medium">
                Upload a resume first
              </a>
            </div>
          </div>
        ) : (
          <select
            value={selectedResumeId}
            onChange={(e) => {
              onSelectResume(e.target.value);
              setErrorMsg(null);
            }}
            className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl px-4 py-3 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all cursor-pointer"
          >
            <option value="" disabled>
              -- Select a resume --
            </option>
            {resumes.map((res) => (
              <option key={res._id} value={res._id}>
                {res.title} {res.fileType ? `(${res.fileType.toUpperCase()})` : ""}
              </option>
            ))}
          </select>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-400" />
            Target Job Description
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePasteSample}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium hover:underline flex items-center gap-1"
            >
              Paste Sample JD
            </button>
            {jobDescription && (
              <button
                type="button"
                onClick={() => onChangeJobDescription("")}
                className="text-xs text-slate-400 hover:text-slate-200 font-medium flex items-center gap-1 ml-2"
              >
                <RefreshCw className="w-3 h-3" />
                Clear
              </button>
            )}
          </div>
        </div>

        <textarea
          rows={7}
          value={jobDescription}
          onChange={(e) => {
            onChangeJobDescription(e.target.value);
            setErrorMsg(null);
          }}
          placeholder="Paste the job description requirements, qualifications, and role responsibilities here..."
          className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl p-4 text-slate-100 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all resize-y"
        />
        <div className="flex justify-between items-center mt-1 text-xs text-slate-400">
          <span>Minimum 30 characters recommended for accurate AI matching.</span>
          <span>{jobDescription.length} chars</span>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={isAnalyzing || isLoadingResumes || resumes.length === 0}
        className="w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Analyzing Resume vs Job Description...
          </>
        ) : (
          <>
            Scan ATS Match & Optimize
          </>
        )}
      </button>
    </form>
  );
};

export default AtsInputSection;
