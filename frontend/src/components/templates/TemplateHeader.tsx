import React from "react";
import { Layout, CheckCircle2, ShieldCheck, FileText } from "lucide-react";

export const TemplateHeader: React.FC = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 sm:p-8 mb-8 shadow-xl">
      
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 -mb-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wide uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ATS Verified Formats</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Professional <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">CV Templates</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Select from battle-tested, single & double column resume layouts optimized to bypass enterprise Applicant Tracking Systems (Taleo, Workday, Greenhouse, Lever).
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-3 w-full lg:w-auto shrink-0">
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-medium text-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>100% ATS Compatibility</span>
          </div>
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-medium text-slate-200">
            <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
            <span>PDF & DOCX Export Ready</span>
          </div>
          <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-medium text-slate-200">
            <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
            <span>Pre-filled Industry Content</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateHeader;
