import React from "react";
import { Plus, FileText, Upload } from "lucide-react";

interface ResumeHeaderProps {
  totalCount: number;
  onOpenUpload: () => void;
}

export const ResumeHeader: React.FC<ResumeHeaderProps> = ({
  totalCount,
  onOpenUpload,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-800/80">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              My Resumes
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-blue-400 border border-blue-500/30">
                {totalCount} {totalCount === 1 ? "File" : "Files"}
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              Manage, analyze, and optimize your resume documents for ATS matching.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <a
          href="/resumes/builder"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 font-medium text-sm transition-all"
        >
          <FileText className="w-4 h-4 text-indigo-400" />
          <span>Visual Builder</span>
        </a>

        <button
          onClick={onOpenUpload}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-sm shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all active:scale-[0.98]"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Resume</span>
        </button>
      </div>
    </div>
  );
};

export default ResumeHeader;
