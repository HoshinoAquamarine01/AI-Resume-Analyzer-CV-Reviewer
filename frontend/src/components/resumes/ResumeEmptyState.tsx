import React from "react";
import { FileSearch, Upload, RefreshCw } from "lucide-react";

interface ResumeEmptyStateProps {
  isSearchActive: boolean;
  onClearSearch: () => void;
  onOpenUpload: () => void;
}

export const ResumeEmptyState: React.FC<ResumeEmptyStateProps> = ({
  isSearchActive,
  onClearSearch,
  onOpenUpload,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 my-8 rounded-3xl bg-[#0e1424]/60 border border-dashed border-slate-800 text-center max-w-md mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4 shadow-inner">
        <FileSearch className="w-8 h-8" />
      </div>

      <h3 className="text-lg font-bold text-white mb-2">
        {isSearchActive ? "No matching resumes found" : "No resumes created yet"}
      </h3>

      <p className="text-sm text-slate-400 mb-6 leading-relaxed">
        {isSearchActive
          ? "We couldn't find any resume documents matching your search query or selected format filter."
          : "Upload your first resume in PDF or DOCX format to start analyzing with AI and matching against job descriptions."}
      </p>

      {isSearchActive ? (
        <button
          onClick={onClearSearch}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Clear Filters & Search</span>
        </button>
      ) : (
        <button
          onClick={onOpenUpload}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/25 transition-all"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Your First Resume</span>
        </button>
      )}
    </div>
  );
};

export default ResumeEmptyState;
