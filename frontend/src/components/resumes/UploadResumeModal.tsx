import React, { useState, useRef } from "react";
import { Upload, X, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface UploadResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
  uploadService: (formData: FormData) => Promise<any>;
}

export const UploadResumeModal: React.FC<UploadResumeModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
  uploadService,
}) => {
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (file: File) => {
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|docx|doc)$/i)) {
      setErrorMsg("Invalid file type. Please upload a PDF or DOCX file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("File size exceeds 10MB limit.");
      return;
    }

    setErrorMsg(null);
    setSelectedFile(file);
    if (!title) {
      const cleanName = file.name.replace(/\.[^/.]+$/, "");
      setTitle(cleanName);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setErrorMsg("Please select a resume file to upload.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg(null);

      const formData = new FormData();
      formData.append("title", title || selectedFile.name.replace(/\.[^/.]+$/, ""));
      formData.append("file", selectedFile);
      const fileType = selectedFile.name.endsWith(".pdf") ? "pdf" : "docx";
      formData.append("fileType", fileType);

      await uploadService(formData);
      toast.success("Resume uploaded successfully!");
      onUploadSuccess();
      onClose();
      
      setTitle("");
      setSelectedFile(null);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to upload resume.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0b0f19] border border-slate-800 shadow-2xl p-6 overflow-hidden">
      
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Upload Resume</h2>
              <p className="text-xs text-slate-400">PDF or DOCX documents up to 10MB</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

   
        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
        
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Resume Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Frontend Developer - 2026"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

        
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              File Document
            </label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? "border-blue-500 bg-blue-500/10"
                  : selectedFile
                  ? "border-emerald-500/50 bg-emerald-500/5"
                  : "border-slate-700 hover:border-slate-600 bg-slate-900/50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
              />

              {selectedFile ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="text-sm font-semibold text-white truncate max-w-xs">
                    {selectedFile.name}
                  </div>
                  <div className="text-xs text-slate-400">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Click or drag to replace
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="p-3 rounded-xl bg-slate-800 text-slate-400 group-hover:text-blue-400 transition-colors">
                    <Upload className="w-8 h-8" />
                  </div>
                  <div className="text-sm font-semibold text-slate-200">
                    Click to upload or drag & drop file
                  </div>
                  <div className="text-xs text-slate-500">Supports PDF, DOCX (Max 10MB)</div>
                </div>
              )}
            </div>
          </div>

         
          {errorMsg && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedFile}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-semibold text-xs shadow-lg shadow-blue-500/25 transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Upload & Analyze</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadResumeModal;
