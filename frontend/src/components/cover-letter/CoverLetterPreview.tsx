import React, { useState } from "react";
import {
  Copy,
  Check,
  Download,
  Edit3,
  Save,
  FileText,
  FileCheck,
  Loader2,
} from "lucide-react";
import { toast } from "react-hot-toast";

export interface CoverLetterData {
  _id?: string;
  jobTitle: string;
  companyName: string;
  content: string;
  createdAt?: string;
}

interface CoverLetterPreviewProps {
  coverLetter: CoverLetterData | null;
  isGenerating: boolean;
  onUpdateContent: (id: string, newContent: string) => Promise<void>;
  onExport: (format: "pdf" | "docx") => Promise<void>;
}

export const CoverLetterPreview: React.FC<CoverLetterPreviewProps> = ({
  coverLetter,
  isGenerating,
  onUpdateContent,
  onExport,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState<string | null>(null);

  const handleStartEdit = () => {
    if (coverLetter) {
      setEditedContent(coverLetter.content);
      setIsEditing(true);
    }
  };

  const handleSaveEdit = async () => {
    if (!coverLetter?._id) return;
    setIsSaving(true);
    try {
      await onUpdateContent(coverLetter._id, editedContent);
      setIsEditing(false);
      toast.success("Cover letter saved successfully!");
    } catch (err) {
      toast.error("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = () => {
    if (!coverLetter?.content) return;
    navigator.clipboard.writeText(isEditing ? editedContent : coverLetter.content);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportFormat = async (format: "pdf" | "docx") => {
    setIsExporting(format);
    try {
      await onExport(format);
      toast.success(`Downloaded ${format.toUpperCase()} file!`);
    } catch (err) {
      toast.error(`Failed to export ${format.toUpperCase()}`);
    } finally {
      setIsExporting(null);
    }
  };

  if (isGenerating) {
    return (
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 min-h-[520px] flex flex-col items-center justify-center text-center space-y-4 shadow-xl">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center animate-pulse">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
          </div>
        </div>
        <div className="space-y-2 max-w-sm">
          <h3 className="text-lg font-semibold text-white">
            Generating Cover Letter...
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Analyzing your resume and matching key qualifications with the job requirements.
          </p>
        </div>
        <div className="w-full max-w-md space-y-3 pt-4">
          <div className="h-4 bg-slate-800 rounded animate-pulse w-3/4 mx-auto" />
          <div className="h-4 bg-slate-800 rounded animate-pulse w-full" />
          <div className="h-4 bg-slate-800 rounded animate-pulse w-5/6 mx-auto" />
          <div className="h-4 bg-slate-800 rounded animate-pulse w-2/3 mx-auto" />
        </div>
      </div>
    );
  }

  if (!coverLetter) {
    return (
      <div className="bg-slate-900/80 border border-slate-800 border-dashed rounded-2xl p-8 min-h-[520px] flex flex-col items-center justify-center text-center space-y-4 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400">
          <FileText className="w-8 h-8 text-slate-500" />
        </div>
        <div className="space-y-1.5 max-w-sm">
          <h3 className="text-base font-semibold text-white">
            No Cover Letter Generated Yet
          </h3>
          <p className="text-xs text-slate-400">
            Fill in the target job details on the left and click{" "}
            <span className="text-blue-400 font-medium">Generate Cover Letter</span>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl flex flex-col min-h-[520px]">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <FileCheck className="w-3.5 h-3.5" />
            <span>Generated Draft</span>
          </span>
          <span className="text-xs text-slate-400 hidden sm:inline">
            {coverLetter.jobTitle} • {coverLetter.companyName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700/60 transition-colors"
            title="Copy full content"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>

          {isEditing ? (
            <button
              onClick={handleSaveEdit}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition-colors"
            >
              {isSaving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>Save</span>
            </button>
          ) : (
            <button
              onClick={handleStartEdit}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700/60 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-400" />
              <span>Edit</span>
            </button>
          )}

          <button
            onClick={() => handleExportFormat("pdf")}
            disabled={isExporting === "pdf"}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors"
          >
            {isExporting === "pdf" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>Export PDF</span>
          </button>

          <button
            onClick={() => handleExportFormat("docx")}
            disabled={isExporting === "docx"}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors"
          >
            {isExporting === "docx" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>DOCX</span>
          </button>
        </div>
      </div>

      <div className="flex-1 bg-white text-slate-900 rounded-xl p-6 sm:p-8 shadow-inner border border-slate-300 font-sans leading-relaxed overflow-y-auto max-h-[600px]">
        {isEditing ? (
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full h-full min-h-[400px] p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-sm font-sans focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed resize-y"
          />
        ) : (
          <div className="whitespace-pre-wrap text-sm sm:text-base space-y-4 font-normal text-slate-800">
            {coverLetter.content}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoverLetterPreview;
