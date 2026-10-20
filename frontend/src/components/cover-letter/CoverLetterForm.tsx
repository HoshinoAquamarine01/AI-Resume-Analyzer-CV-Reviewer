import React from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Briefcase,
  Building2,
  FileCode,
  Send,
  Loader2,
  AlertCircle,
  PlusCircle,
} from "lucide-react";

export interface ResumeOption {
  _id: string;
  title: string;
  createdAt?: string;
}

interface CoverLetterFormProps {
  resumes: ResumeOption[];
  isLoadingResumes: boolean;
  selectedResumeId: string;
  setSelectedResumeId: (id: string) => void;
  jobTitle: string;
  setJobTitle: (val: string) => void;
  companyName: string;
  setCompanyName: (val: string) => void;
  jobDescription: string;
  setJobDescription: (val: string) => void;
  tone: string;
  setTone: (val: string) => void;
  isGenerating: boolean;
  onGenerate: (e: React.FormEvent) => void;
}

const TONE_OPTIONS = [
  {
    id: "professional",
    label: "Professional",
    desc: "Formal & corporate standard",
    icon: "💼",
  },
  {
    id: "confident",
    label: "Confident",
    desc: "Highlights strengths & achievements",
    icon: "⚡",
  },
  {
    id: "creative",
    label: "Creative",
    desc: "Engaging & distinctive approach",
    icon: "🎨",
  },
  {
    id: "enthusiastic",
    label: "Enthusiastic",
    desc: "Passionate & aligned with values",
    icon: "🔥",
  },
];

export const CoverLetterForm: React.FC<CoverLetterFormProps> = ({
  resumes,
  isLoadingResumes,
  selectedResumeId,
  setSelectedResumeId,
  jobTitle,
  setJobTitle,
  companyName,
  setCompanyName,
  jobDescription,
  setJobDescription,
  tone,
  setTone,
  isGenerating,
  onGenerate,
}) => {
  return (
    <form
      onSubmit={onGenerate}
      className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xl backdrop-blur-sm"
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/60">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-400" />
          Application Details
        </h2>
        <span className="text-xs text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700/50">
          Step 1 of 2
        </span>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300 flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-400" />
          Select Base Resume <span className="text-rose-500">*</span>
        </label>

        {isLoadingResumes ? (
          <div className="flex items-center gap-2 text-xs text-slate-400 py-3 px-4 bg-slate-800/50 rounded-xl border border-slate-700/40">
            <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
            <span>Loading your resumes...</span>
          </div>
        ) : resumes.length === 0 ? (
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>No resumes found in your profile.</span>
            </div>
            <Link
              to="/resumes"
              className="inline-flex items-center gap-1 bg-amber-500 text-slate-950 font-semibold px-3 py-1.5 rounded-lg text-xs hover:bg-amber-400 transition-colors shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Upload CV
            </Link>
          </div>
        ) : (
          <select
            value={selectedResumeId}
            onChange={(e) => setSelectedResumeId(e.target.value)}
            required
            className="w-full bg-slate-800/90 border border-slate-700/70 rounded-xl px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          >
            <option value="" disabled>
              -- Select a resume from your list --
            </option>
            {resumes.map((resume) => (
              <option key={resume._id} value={resume._id}>
                📄 {resume.title}{" "}
                {resume.createdAt
                  ? `(${new Date(resume.createdAt).toLocaleDateString("en-US")})`
                  : ""}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-400" />
            Target Job Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. Senior Software Engineer"
            required
            className="w-full bg-slate-800/90 border border-slate-700/70 rounded-xl px-4 py-2.5 text-slate-100 text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-400" />
            Company Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g. Google / Microsoft"
            required
            className="w-full bg-slate-800/90 border border-slate-700/70 rounded-xl px-4 py-2.5 text-slate-100 text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300 flex items-center gap-2">
          <FileCode className="w-4 h-4 text-blue-400" />
          Job Description (JD) <span className="text-rose-500">*</span>
        </label>
        <textarea
          rows={5}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description, key responsibilities, and requirements here..."
          required
          className="w-full bg-slate-800/90 border border-slate-700/70 rounded-xl px-4 py-3 text-slate-100 text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-y"
        />
      </div>

      <div className="space-y-2.5">
        <label className="block text-sm font-medium text-slate-300">
          Tone of Voice
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          {TONE_OPTIONS.map((opt) => {
            const isSelected = tone === opt.id;
            return (
              <button
                type="button"
                key={opt.id}
                onClick={() => setTone(opt.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "bg-blue-500/15 border-blue-500 text-white shadow-sm ring-1 ring-blue-500/30"
                    : "bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <span>{opt.icon}</span>
                  <span>{opt.label}</span>
                </div>
                <p className="text-[11px] opacity-75 mt-0.5 line-clamp-1">
                  {opt.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isGenerating || isLoadingResumes || resumes.length === 0}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium py-3.5 px-6 rounded-xl shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2.5 transition-all duration-200"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generating Cover Letter...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Generate Cover Letter</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default CoverLetterForm;
