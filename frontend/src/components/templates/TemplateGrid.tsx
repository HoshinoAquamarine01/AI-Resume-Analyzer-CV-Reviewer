import React from "react";
import { FileQuestion, RefreshCw } from "lucide-react";
import { ResumeTemplate } from "../../types/template";
import TemplateCard from "./TemplateCard";

interface TemplateGridProps {
  templates: ResumeTemplate[];
  loading: boolean;
  onPreview: (template: ResumeTemplate) => void;
  onSelect: (template: ResumeTemplate) => void;
  onResetFilters: () => void;
}

export const TemplateGrid: React.FC<TemplateGridProps> = ({
  templates,
  loading,
  onPreview,
  onSelect,
  onResetFilters,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div
            key={idx}
            className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 space-y-4 animate-pulse"
          >
            <div className="h-40 bg-slate-800/80 rounded-xl" />
            <div className="h-5 bg-slate-800/80 rounded w-3/4" />
            <div className="h-4 bg-slate-800/60 rounded w-full" />
            <div className="h-4 bg-slate-800/60 rounded w-2/3" />
            <div className="pt-4 flex gap-2">
              <div className="h-9 bg-slate-800/80 rounded-xl flex-1" />
              <div className="h-9 bg-slate-800/80 rounded-xl flex-1" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="rounded-2xl bg-slate-900/40 border border-slate-800/80 p-12 text-center flex flex-col items-center justify-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400">
          <FileQuestion className="w-7 h-7" />
        </div>
        <div className="space-y-1 max-w-sm">
          <h3 className="text-base font-bold text-white">No Matching Templates Found</h3>
          <p className="text-xs text-slate-400">
            We couldn't find any templates matching your search criteria or category filter.
          </p>
        </div>
        <button
          onClick={onResetFilters}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset All Filters</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          onPreview={onPreview}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
};

export default TemplateGrid;
