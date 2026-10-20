import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Target } from "lucide-react";

export const AtsHeader: React.FC = () => {
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
          <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full text-indigo-400 text-xs font-semibold tracking-wide">
            <span>AI Resume Optimizer</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2.5">
          <Target className="w-7 h-7 text-indigo-400" />
          ATS Compatibility Matcher
        </h1>
        <p className="text-slate-400 text-sm mt-1 max-w-2xl">
          Scan your resume against any job description to find missing keywords, measure ATS match score, and get instant recommendations to pass recruiter screeners.
        </p>
      </div>
    </div>
  );
};

export default AtsHeader;
