import React from "react";
import { ArrowLeft, RefreshCw, Download, Trash2, Calendar, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ResumeDetailHeaderProps {
  title?: string;
  fileType?: string;
  createdAt?: string;
  updatedAt?: string;
  isAnalyzing: boolean;
  onAnalyze: () => void;
  onDownload: () => void;
  onDelete: () => void;
}

export const ResumeDetailHeader: React.FC<ResumeDetailHeaderProps> = ({
  title,
  fileType,
  createdAt,
  updatedAt,
  isAnalyzing,
  onAnalyze,
  onDownload,
  onDelete,
}) => {
  const navigate = useNavigate();

  const formattedDate = updatedAt || createdAt
    ? new Date(updatedAt || createdAt!).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  const isPdf = fileType?.toLowerCase() === "pdf";

  return (
    <div className="space-y-4">
      
      <div>
        <button
          onClick={() => navigate("/resumes")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors bg-slate-900/60 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Resumes</span>
        </button>
      </div>

 
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-6 rounded-2xl shadow-xl backdrop-blur-xl">
        <div className="flex items-start gap-4">
          
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-sm uppercase shadow-inner shrink-0 ${
              isPdf
                ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
            }`}
          >
            {isPdf ? "PDF" : "DOCX"}
          </div>

          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {title || "Untitled Resume"}
            </h1>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Updated {formattedDate}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-700" />
              <span className="flex items-center gap-1 text-slate-400 font-medium">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                {fileType?.toUpperCase() || "DOCUMENT"}
              </span>
            </div>
          </div>
        </div>

        
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onAnalyze}
            disabled={isAnalyzing}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isAnalyzing ? "animate-spin text-amber-300" : "text-blue-200"}`} />
            <span>{isAnalyzing ? "Analyzing..." : "Re-Scan AI"}</span>
          </button>

          <button
            onClick={onDownload}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/80 transition-colors text-xs font-medium flex items-center gap-2"
            title="Download Original File"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">Download</span>
          </button>

          <button
            onClick={onDelete}
            className="p-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors text-xs font-medium"
            title="Delete Resume"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeDetailHeader;
