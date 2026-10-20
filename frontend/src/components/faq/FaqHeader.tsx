import React from "react";
import { Search, X, HelpCircle, FileText } from "lucide-react";

interface FaqHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  totalQuestions: number;
}

export const FaqHeader: React.FC<FaqHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  totalQuestions,
}) => {
  return (
    <div className="text-center max-w-3xl mx-auto mb-12 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6 backdrop-blur-md">
        <HelpCircle className="w-3.5 h-3.5" />
        <span>CV<span className="text-white">Pulse</span> Help Center</span>
      </div>

      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
        Frequently Asked <br className="hidden sm:inline" />
        <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Questions & Answers</span>
      </h1>

      <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-8">
        Everything you need to know about ATS scoring algorithms, CV file formats, 
        privacy policy, and upgrading to CVPulse Pro.
      </p>

      <div className="relative max-w-xl mx-auto">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g. ATS Score, PDF, Security, Payments...)"
            className="w-full pl-12 pr-10 py-3.5 bg-slate-900/80 border border-slate-700/80 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-slate-100 placeholder-slate-500 rounded-2xl text-sm transition-all shadow-xl backdrop-blur-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 mt-2.5 px-2">
          <span className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            Showing {totalQuestions} help articles
          </span>
          {searchQuery && (
            <span className="text-slate-400">
              Results for: <strong className="text-emerald-400">"{searchQuery}"</strong>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FaqHeader;
