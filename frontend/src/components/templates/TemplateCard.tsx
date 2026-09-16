import React from "react";
import { Eye, ArrowRight, Star, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";
import { ResumeTemplate } from "../../types/template";

interface TemplateCardProps {
  template: ResumeTemplate;
  onPreview: (template: ResumeTemplate) => void;
  onSelect: (template: ResumeTemplate) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onPreview,
  onSelect,
}) => {
  return (
    <div className="group relative rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 transition-all duration-300 flex flex-col overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-500/10">
    
      <div
        className="h-44 w-full relative p-4 flex flex-col justify-between overflow-hidden transition-all duration-300"
        style={{
          background: `linear-gradient(135deg, ${template.colorScheme.bg} 0%, #090d16 100%)`,
        }}
      >
     
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(${template.colorScheme.primary} 1px, transparent 1px)`,
            backgroundSize: "16px 16px",
          }}
        />

       
        <div className="relative z-10 flex items-center justify-between gap-2">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-950/80 backdrop-blur-md text-slate-300 border border-slate-800 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-blue-400" />
            <span>{template.categoryName}</span>
          </span>

          <div className="flex items-center gap-1.5">
            {template.popular && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                Popular
              </span>
            )}
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              {template.atsScore}% ATS
            </span>
          </div>
        </div>

       
        <div className="relative z-10 mx-auto w-3/4 h-24 bg-slate-950/90 rounded-lg p-2.5 border border-slate-800 shadow-xl group-hover:scale-105 transition-transform duration-300 flex flex-col gap-1.5">
        
          <div className="w-1/2 h-2 rounded bg-blue-500/80" />
          <div className="w-1/3 h-1.5 rounded bg-slate-600" />
          <div className="w-full h-px bg-slate-800 my-0.5" />
        
          <div className="w-full h-1 rounded bg-slate-700/80" />
          <div className="w-5/6 h-1 rounded bg-slate-700/60" />
          <div className="w-4/6 h-1 rounded bg-slate-700/40" />
          <div className="w-full h-px bg-slate-800 my-0.5" />
          <div className="w-2/3 h-1 rounded bg-slate-700/80" />
        </div>

       
        <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-20">
          <button
            onClick={() => onPreview(template)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 border border-slate-600 shadow-md transition-transform active:scale-95"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick Preview</span>
          </button>
        </div>
      </div>

    
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
            {template.title}
          </h3>

          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
            {template.description}
          </p>
        </div>

      
        <div className="space-y-3 pt-2 border-t border-slate-800/80">
          <div className="flex flex-wrap gap-1.5">
            {template.recommendedFor.slice(0, 3).map((role, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800/80 text-slate-300 border border-slate-700/50"
              >
                {role}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
              {template.sections.length} Core Sections
            </span>
            <span className="font-mono text-blue-400">PDF & DOCX</span>
          </div>
        </div>

      
        <div className="pt-3 flex items-center gap-2">
          <button
            onClick={() => onPreview(template)}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview</span>
          </button>

          <button
            onClick={() => onSelect(template)}
            className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-1.5 active:scale-95"
          >
            <span>Use Template</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;
