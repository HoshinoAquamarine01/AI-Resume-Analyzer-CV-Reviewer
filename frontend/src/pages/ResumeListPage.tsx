import React, { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { Loader2, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";

import MainLayout from "../components/layout/MainLayout";
import ResumeHeader from "../components/resumes/ResumeHeader";
import ResumeFilterBar, { FormatFilter, SortOption } from "../components/resumes/ResumeFilterBar";
import ResumeCard, { ResumeItem } from "../components/resumes/ResumeCard";
import UploadResumeModal from "../components/resumes/UploadResumeModal";
import ResumeEmptyState from "../components/resumes/ResumeEmptyState";
import resumeService from "../services/resumeService";

export const ResumeListPage: React.FC = () => {
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [formatFilter, setFormatFilter] = useState<FormatFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  const fetchResumes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let response: any;
      if (searchQuery.trim()) {
        response = await resumeService.searchResumes(searchQuery, page, 12);
      } else {
        response = await resumeService.getResumes(page, 12);
      }

      const payload = response?.data || response;
      let items: ResumeItem[] = [];

      if (Array.isArray(payload)) {
        items = payload;
        setTotalCount(payload.length);
        setTotalPages(1);
      } else if (payload && Array.isArray(payload.items)) {
        items = payload.items;
        setTotalCount(payload.total || payload.items.length);
        setTotalPages(payload.totalPages || Math.ceil((payload.total || payload.items.length) / 12) || 1);
      } else if (payload && Array.isArray(payload.resumes)) {
        items = payload.resumes;
        setTotalCount(payload.total || payload.resumes.length);
        setTotalPages(payload.totalPages || 1);
      } else {
        items = [];
        setTotalCount(0);
        setTotalPages(1);
      }

      setResumes(items);
    } catch (err: any) {
      console.error("Failed to fetch resumes:", err);
      const msg = err?.response?.data?.message || err?.message || "Failed to load resumes.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, page]);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const filteredResumes = resumes
    .filter((item) => {
      if (formatFilter === "pdf") {
        return item.fileType?.toLowerCase() === "pdf" || item.fileUrl?.endsWith(".pdf");
      }
      if (formatFilter === "docx") {
        return item.fileType?.toLowerCase() === "docx" || item.fileUrl?.endsWith(".docx") || item.fileUrl?.endsWith(".doc");
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "title") {
        return (a.title || "").localeCompare(b.title || "");
      }
      const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
      return sortBy === "oldest" ? dateA - dateB : dateB - dateA;
    });

  const handleDuplicate = async (resumeId: string) => {
    try {
      toast.loading("Duplicating resume...", { id: "dup" });
      await resumeService.duplicateResume(resumeId);
      toast.success("Resume duplicated successfully!", { id: "dup" });
      fetchResumes();
    } catch (err: any) {
      toast.error("Failed to duplicate resume.", { id: "dup" });
    }
  };

  const handleDelete = async (resumeId: string) => {
    if (!window.confirm("Are you sure you want to delete this resume? This action cannot be undone.")) {
      return;
    }
    try {
      toast.loading("Deleting resume...", { id: "del" });
      await resumeService.deleteResume(resumeId);
      toast.success("Resume deleted.", { id: "del" });
      fetchResumes();
    } catch (err: any) {
      toast.error("Failed to delete resume.", { id: "del" });
    }
  };

  const handleDownload = async (resumeId: string, title: string) => {
    try {
      toast.loading("Preparing download...", { id: "dl" });
      const blob = await resumeService.downloadResume(resumeId);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${title || "resume"}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Download started!", { id: "dl" });
    } catch (err: any) {
      toast.error("Failed to download file.", { id: "dl" });
    }
  };

  const handleShare = async (resumeId: string) => {
    try {
      const shareData = await resumeService.shareResume(resumeId);
      const shareUrl = shareData?.shareUrl || `${window.location.origin}/resumes/${resumeId}`;
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Shareable link copied to clipboard!");
    } catch (err: any) {
      toast.error("Failed to generate share link.");
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6 pb-12">
      
        <ResumeHeader
          totalCount={totalCount}
          onOpenUpload={() => setIsUploadModalOpen(true)}
        />

        <ResumeFilterBar
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            setPage(1);
          }}
          formatFilter={formatFilter}
          onFormatChange={setFormatFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={fetchResumes}
              className="px-3 py-1 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-xs font-semibold text-rose-300 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="h-56 rounded-2xl bg-[#0e1424]/80 border border-slate-800/80 p-5 animate-pulse flex flex-col justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-800" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-800 rounded w-3/4" />
                    <div className="h-3 bg-slate-800/60 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-10 bg-slate-800/50 rounded-xl my-4" />
                <div className="h-8 bg-slate-800 rounded-xl" />
              </div>
            ))}
          </div>
        ) : filteredResumes.length === 0 ? (
        
          <ResumeEmptyState
            isSearchActive={Boolean(searchQuery || formatFilter !== "all")}
            onClearSearch={() => {
              setSearchQuery("");
              setFormatFilter("all");
            }}
            onOpenUpload={() => setIsUploadModalOpen(true)}
          />
        ) : (
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResumes.map((resume) => (
              <ResumeCard
                key={resume._id}
                resume={resume}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
                onDownload={handleDownload}
                onShare={handleShare}
              />
            ))}
          </div>
        )}

        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between pt-6 border-t border-slate-800/80">
            <div className="text-xs text-slate-400 font-medium">
              Page <span className="text-white font-semibold">{page}</span> of{" "}
              <span className="text-white font-semibold">{totalPages}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="p-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                className="p-2 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <UploadResumeModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={fetchResumes}
        uploadService={resumeService.createResume}
      />
    </MainLayout>
  );
};

export default ResumeListPage;
