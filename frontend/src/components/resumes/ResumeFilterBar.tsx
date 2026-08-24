import React from "react";
import { Search, X, Filter, ArrowUpDown } from "lucide-react";

export type FormatFilter = "all" | "pdf" | "docx";
export type SortOption = "newest" | "oldest" | "title";

interface ResumeFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  formatFilter: FormatFilter;
  onFormatChange: (format: FormatFilter) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export const ResumeFilterBar: React.FC<ResumeFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  formatFilter,
  onFormatChange,
  sortBy,
  onSortChange,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0e1424]/90 border border-slate-800/80 backdrop-blur-md shadow-sm">
 
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search resumes by title or content..."
          className="w-full pl-10 pr-9 py-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

     
      <div className="flex flex-wrap items-center gap-3">
        
        <div className="flex items-center p-1 rounded-xl bg-slate-900/80 border border-slate-800">
          {(["all", "pdf", "docx"] as FormatFilter[]).map((fmt) => (
            <button
              key={fmt}
              onClick={() => onFormatChange(fmt)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                formatFilter === fmt
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-500/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>

      
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-medium text-slate-300">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400 hidden sm:inline">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="bg-transparent text-white focus:outline-none cursor-pointer border-none p-0 text-xs font-semibold"
          >
            <option value="newest" className="bg-slate-900 text-white">
              Newest First
            </option>
            <option value="oldest" className="bg-slate-900 text-white">
              Oldest First
            </option>
            <option value="title" className="bg-slate-900 text-white">
              Title (A-Z)
            </option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ResumeFilterBar;
