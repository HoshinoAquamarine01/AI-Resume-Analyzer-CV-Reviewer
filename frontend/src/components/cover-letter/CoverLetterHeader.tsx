import React from "react";
import { Link } from "react-router-dom";
import { History, ArrowLeft, FileText, Send } from "lucide-react";

interface CoverLetterHeaderProps {
  historyCount: number;
  onOpenHistory: () => void;
}

export const CoverLetterHeader: React.FC<CoverLetterHeaderProps> = ({
  historyCount,
  onOpenHistory,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-slate-800/80">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Link
            to="/dashboard"
            className="p-2 rounded-lg bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full text-blue-400 text-xs font-semibold tracking-wide">
            <Send className="w-3.5 h-3.5 text-blue-400" />
            <span>Application Tools</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
          <FileText className="w-7 h-7 text-blue-500" />
          Cover Letter Generator
        </h1>
        <p className="text-slate-400 text-sm mt-1 max-w-2xl">
          Generate tailored, professional cover letters aligned with your resume and job specifications.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onOpenHistory}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700/60 rounded-xl text-sm font-medium transition-all shadow-sm group"
        >
          <History className="w-4 h-4 text-blue-400 group-hover:rotate-[-20deg] transition-transform" />
          <span>Saved Letters</span>
          {historyCount > 0 && (
            <span className="ml-1 px-2 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold rounded-full">
              {historyCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default CoverLetterHeader;
