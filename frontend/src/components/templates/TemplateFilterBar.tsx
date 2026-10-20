import React from "react";
import { Search, SlidersHorizontal, ShieldCheck, Code, Briefcase, Award, Palette, TrendingUp, DollarSign, Layers } from "lucide-react";
import { TemplateCategory, TemplateFilterState } from "../../types/template";

interface TemplateFilterBarProps {
  filters: TemplateFilterState;
  onFilterChange: (newFilters: Partial<TemplateFilterState>) => void;
  totalCount: number;
}

const CATEGORIES: TemplateCategory[] = [
  { id: "all", name: "All Templates" },
  { id: "topcv", name: "TopCV Series" },
  { id: "tech", name: "Tech & Engineering" },
  { id: "executive", name: "Executive & Leadership" },
  { id: "minimal", name: "Minimal & ATS Clean" },
  { id: "creative", name: "Creative & Design" },
  { id: "marketing", name: "Marketing & Sales" },
  { id: "finance", name: "Finance & Banking" },
];

export const TemplateFilterBar: React.FC<TemplateFilterBarProps> = ({
  filters,
  onFilterChange,
  totalCount,
}) => {
  return (
    <div className="space-y-4 mb-8">
     
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = filters.category === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onFilterChange({ category: cat.id })}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2 border ${
                isActive
                  ? "bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20"
                  : "bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              {cat.id === "all" && <Layers className="w-3.5 h-3.5" />}
              {cat.id === "topcv" && <Award className="w-3.5 h-3.5 text-emerald-400" />}
              {cat.id === "tech" && <Code className="w-3.5 h-3.5" />}
              {cat.id === "executive" && <Briefcase className="w-3.5 h-3.5" />}
              {cat.id === "minimal" && <ShieldCheck className="w-3.5 h-3.5" />}
              {cat.id === "creative" && <Palette className="w-3.5 h-3.5" />}
              {cat.id === "marketing" && <TrendingUp className="w-3.5 h-3.5" />}
              {cat.id === "finance" && <DollarSign className="w-3.5 h-3.5" />}
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

   
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
      
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Search templates by role, tech stack, or industry..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ search: "" })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
            >
              Clear
            </button>
          )}
        </div>

      
        <div className="flex items-center gap-3 justify-between sm:justify-end">
        
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
              className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="popular">Most Popular</option>
              <option value="ats">Highest ATS Score</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>

         
          <div className="px-3 py-1.5 rounded-lg bg-slate-800/60 text-slate-400 text-xs font-mono">
            {totalCount} {totalCount === 1 ? "template" : "templates"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateFilterBar;
