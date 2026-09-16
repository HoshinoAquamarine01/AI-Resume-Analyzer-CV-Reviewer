import React, { useState } from "react";
import { Briefcase, Building, FileText, Sparkles, Code, Users, ArrowRight } from "lucide-react";
import { SessionType } from "../../types/interview.types";

interface ResumeOption {
  _id: string;
  title?: string;
  targetRole?: string;
}

interface InterviewSetupFormProps {
  resumes: ResumeOption[];
  loadingResumes: boolean;
  onSubmit: (data: {
    resumeId: string;
    jobTitle: string;
    companyName: string;
    sessionType: SessionType;
  }) => void;
  loading: boolean;
}

export const InterviewSetupForm: React.FC<InterviewSetupFormProps> = ({
  resumes,
  loadingResumes,
  onSubmit,
  loading,
}) => {
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [jobTitle, setJobTitle] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [sessionType, setSessionType] = useState<SessionType>("technical");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedResumeId || !jobTitle.trim() || !companyName.trim()) {
      return;
    }
    onSubmit({
      resumeId: selectedResumeId,
      jobTitle: jobTitle.trim(),
      companyName: companyName.trim(),
      sessionType,
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
      <div className="mb-8">
        <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
          <Sparkles className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Step 1: Setup AI Mock Interview</h2>
        <p className="text-slate-400 text-sm">
          Select your target resume and job details so AI can generate tailored interview questions.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-400" />
            Select Target Resume
          </label>

          {loadingResumes ? (
            <div className="h-11 bg-slate-800/50 rounded-xl animate-pulse flex items-center px-4 text-slate-500 text-sm">
              Loading your resumes...
            </div>
          ) : resumes.length === 0 ? (
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-sm">
              No resumes found. Please create or upload a resume under <strong>My Resumes</strong> first!
            </div>
          ) : (
            <select
              value={selectedResumeId}
              onChange={(e) => setSelectedResumeId(e.target.value)}
              required
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm"
            >
              <option value="" disabled>-- Select a Resume --</option>
              {resumes.map((resume) => (
                <option key={resume._id} value={resume._id}>
                  {resume.title || resume.targetRole || `Resume #${resume._id.slice(-4)}`}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-400" />
            Target Job Title
          </label>
          <input
            type="text"
            placeholder="e.g. Senior Frontend Developer, Data Analyst, ReactJS Engineer..."
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            required
            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
            <Building className="w-4 h-4 text-blue-400" />
            Target Company Name
          </label>
          <input
            type="text"
            placeholder="e.g. Google, Microsoft, Amazon, Tech Corp..."
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Interview Type
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setSessionType("technical")}
              className={`p-4 rounded-xl border flex flex-col items-start gap-2 transition-all ${
                sessionType === "technical"
                  ? "bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10"
                  : "bg-slate-800/40 border-slate-700 text-slate-400 hover:border-slate-600"
              }`}
            >
              <div className="flex items-center gap-2 font-semibold text-sm">
                <Code className="w-4 h-4 text-blue-400" />
                Technical Interview
              </div>
              <span className="text-xs text-slate-400 text-left">
                Focuses on domain knowledge, system design, coding & tech stack questions.
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSessionType("hr")}
              className={`p-4 rounded-xl border flex flex-col items-start gap-2 transition-all ${
                sessionType === "hr"
                  ? "bg-purple-600/20 border-purple-500 text-white shadow-lg shadow-purple-500/10"
                  : "bg-slate-800/40 border-slate-700 text-slate-400 hover:border-slate-600"
              }`}
            >
              <div className="flex items-center gap-2 font-semibold text-sm">
                <Users className="w-4 h-4 text-purple-400" />
                HR & Behavioral
              </div>
              <span className="text-xs text-slate-400 text-left">
                Focuses on soft skills, situational judgment, leadership & culture fit.
              </span>
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !selectedResumeId || !jobTitle.trim() || !companyName.trim()}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              AI is Generating Questions...
            </>
          ) : (
            <>
              Start Mock Interview <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default InterviewSetupForm;
