import React, { useState } from "react";
import {
  FileText,
  Sparkles,
  Download,
  Copy,
  Trash2,
  Share2,
  MoreVertical,
  Calendar,
  ExternalLink,
  Check,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface ResumeItem {
  _id: string;
  title: string;
  fileUrl?: string;
  fileType?: "pdf" | "docx";
  atsScore?: number;
  score?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface ResumeCardProps {
  resume: ResumeItem;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onDownload: (id: string, title: string) => void;
  onShare: (id: string) => void;
}

export const ResumeCard: React.FC<ResumeCardProps> = ({
  resume,
  onDuplicate,
  onDelete,
  onDownload,
  onShare,
}) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const formattedDate = resume.updatedAt || resume.createdAt
    ? new Date(resume.updatedAt || resume.createdAt!).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  const isPdf = resume.fileType?.toLowerCase() === "pdf" || resume.fileUrl?.endsWith(".pdf");
  const score = resume.atsScore ?? resume.score;

  const handleShareClick = () => {
    setShowMenu(false);
    onShare(resume._id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative bg-[#0e1424]/90 hover:bg-[#12192c] border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 transition-all duration-300 shadow-lg hover:shadow-blue-500/5 flex flex-col justify-between">
    
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
         
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xs uppercase shadow-md transition-transform group-hover:scale-105 ${
              isPdf
                ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
            }`}
          >
            {isPdf ? "PDF" : "DOCX"}
          </div>

          <div>
            <h3
              onClick={() => navigate(`/resumes/${resume._id}`)}
              className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-1 cursor-pointer"
              title={resume.title}
            >
              {resume.title || "Untitled Resume"}
            </h3>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Updated {formattedDate}</span>
            </div>
          </div>
        </div>

       
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          
          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-8 z-30 w-48 py-1.5 rounded-xl bg-slate-900 border border-slate-700 shadow-xl text-xs font-medium text-slate-200 animate-in fade-in zoom-in-95 duration-150">
                <button
                  onClick={() => {
                    setShowMenu(false);
                    navigate(`/resumes/${resume._id}`);
                  }}
                  className="w-full px-3.5 py-2 flex items-center gap-2.5 hover:bg-slate-800 hover:text-blue-400 transition-colors text-left"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>Analyze with AI</span>
                </button>

                <button
                  onClick={() => {
                    setShowMenu(false);
                    onDuplicate(resume._id);
                  }}
                  className="w-full px-3.5 py-2 flex items-center gap-2.5 hover:bg-slate-800 hover:text-white transition-colors text-left"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Duplicate</span>
                </button>

                <button
                  onClick={() => {
                    setShowMenu(false);
                    onDownload(resume._id, resume.title);
                  }}
                  className="w-full px-3.5 py-2 flex items-center gap-2.5 hover:bg-slate-800 hover:text-white transition-colors text-left"
                >
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                  <span>Download</span>
                </button>

                <button
                  onClick={handleShareClick}
                  className="w-full px-3.5 py-2 flex items-center gap-2.5 hover:bg-slate-800 hover:text-white transition-colors text-left"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Share2 className="w-3.5 h-3.5 text-slate-400" />
                  )}
                  <span>{copied ? "Link Copied!" : "Share Link"}</span>
                </button>

                <div className="my-1 border-t border-slate-800" />

                <button
                  onClick={() => {
                    setShowMenu(false);
                    onDelete(resume._id);
                  }}
                  className="w-full px-3.5 py-2 flex items-center gap-2.5 hover:bg-rose-500/10 text-rose-400 transition-colors text-left"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Resume</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>


      <div className="my-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>ATS Optimised Score</span>
        </div>
        {score !== undefined ? (
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              score >= 80
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : score >= 60
                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
            }`}
          >
            {score}%
          </span>
        ) : (
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
            Not Scanned
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60">
        <button
          onClick={() => navigate(`/resumes/${resume._id}`)}
          className="flex-1 py-2 rounded-xl bg-blue-600/15 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
        >
          <span>View Details & AI Scans</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onDownload(resume._id, resume.title)}
          title="Quick Download"
          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-medium transition-colors"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ResumeCard;
