import React, { useState } from "react";
import { X, Search, Trash2, Calendar, Building2, FileText, ArrowRight, Loader2 } from "lucide-react";
import { CoverLetterItem } from "../../services/coverLetterService";

interface CoverLetterHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CoverLetterItem[];
  isLoading: boolean;
  onSelect: (item: CoverLetterItem) => void;
  onDelete: (id: string) => Promise<void>;
}

export const CoverLetterHistoryModal: React.FC<CoverLetterHistoryModalProps> = ({
  isOpen,
  onClose,
  items,
  isLoading,
  onSelect,
  onDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredItems = items.filter((item) => {
    const query = searchTerm.toLowerCase();
    return (
      item.jobTitle?.toLowerCase().includes(query) ||
      item.companyName?.toLowerCase().includes(query) ||
      item.content?.toLowerCase().includes(query)
    );
  });

  const handleDeleteItem = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this cover letter?")) return;

    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Saved Cover Letters</h3>
              <p className="text-xs text-slate-400">
                View and manage all your previously generated application letters.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-slate-800/80 bg-slate-950/40">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by job title or company name..."
              className="w-full bg-slate-900 border border-slate-700/70 rounded-xl pl-10 pr-4 py-2 text-slate-100 text-sm placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          {isLoading ? (
            <div className="py-12 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto" />
              <p className="text-xs text-slate-400">Loading saved letters...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <FileText className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-medium text-slate-300">No cover letters found</p>
              <p className="text-xs text-slate-500">
                {searchTerm ? "Try searching with a different keyword." : "You haven't saved any cover letters yet."}
              </p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item._id}
                onClick={() => {
                  onSelect(item);
                  onClose();
                }}
                className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-blue-500/50 hover:bg-slate-800/80 transition-all cursor-pointer group flex items-center justify-between gap-4"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-sm truncate group-hover:text-blue-400 transition-colors">
                      {item.jobTitle || "Untitled Position"}
                    </span>
                    {item.companyName && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-slate-700/60 text-slate-300">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        {item.companyName}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {item.content}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-US") : "N/A"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => handleDeleteItem(e, item._id)}
                    disabled={deletingId === item._id}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete cover letter"
                  >
                    {deletingId === item._id ? (
                      <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                  <div className="p-2 rounded-lg text-slate-400 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CoverLetterHistoryModal;
