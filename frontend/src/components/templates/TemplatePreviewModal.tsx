import React from "react";
import { X, ArrowRight, ShieldCheck, Sparkles, Check, FileText, Download, Briefcase, GraduationCap, Award } from "lucide-react";
import { ResumeTemplate } from "../../types/template";

interface TemplatePreviewModalProps {
  template: ResumeTemplate | null;
  onClose: () => void;
  onSelect: (template: ResumeTemplate) => void;
}

export const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({
  template,
  onClose,
  onSelect,
}) => {
  if (!template) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]">
       
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">{template.title}</h2>
              <p className="text-xs text-slate-400 font-mono">{template.categoryName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              {template.atsScore}% ATS Pass Score
            </span>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

      
        <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar flex-1">
       
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Description</span>
              <p className="text-xs text-slate-200 mt-1 leading-relaxed">{template.description}</p>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Best Suited For</span>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {template.recommendedFor.map((role, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                    {role}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Key Features</span>
              <ul className="mt-1.5 space-y-1">
                {template.tags.map((tag, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-center gap-1.5">
                    <Check className="w-3 h-3 text-blue-400 shrink-0" />
                    <span>{tag}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

      
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-400" />
                <span>Live Document Layout Preview</span>
              </h3>
              <span className="text-[11px] text-slate-500 font-mono">Standard Letter / A4 Format</span>
            </div>

            <div className="w-full bg-slate-950 p-6 sm:p-8 rounded-xl border border-slate-800 text-slate-200 shadow-inner font-sans space-y-6">
          
              <div className="border-b border-slate-800 pb-4">
                <h1 className="text-xl sm:text-2xl font-bold text-white">{template.sampleData.name}</h1>
                <p className="text-xs sm:text-sm text-blue-400 font-medium mt-0.5">{template.sampleData.title}</p>
                <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">{template.sampleData.summary}</p>
              </div>

           
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-blue-400" />
                  <span>Technical & Professional Competencies</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {template.sampleData.skills.map((skill, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded bg-slate-900 text-xs text-slate-200 border border-slate-800">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

            
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Professional Work History</span>
                </h4>
                <div className="space-y-2">
                  {template.sampleData.experience.map((exp, idx) => (
                    <div key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-blue-400 font-bold">•</span>
                      <span>{exp}</span>
                    </div>
                  ))}
                </div>
              </div>

              
              <div className="pt-4 border-t border-slate-800/80">
                <span className="text-[11px] text-slate-500 font-mono block mb-2">
                  Document Sections Included ({template.sections.length})
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {template.sections.map((sec, idx) => (
                    <div key={idx} className="p-2 rounded bg-slate-900/80 border border-slate-800 text-[11px]">
                      <span className="font-semibold text-slate-300 block">{sec.name}</span>
                      <span className="text-slate-500 text-[10px]">{sec.fields.join(", ")}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

       
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between shrink-0 gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
          >
            Back to Templates
          </button>

          <button
            onClick={() => {
              onClose();
              onSelect(template);
            }}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 active:scale-95"
          >
            <span>Use Template to Build CV</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplatePreviewModal;
