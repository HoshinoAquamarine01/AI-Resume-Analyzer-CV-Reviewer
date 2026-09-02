import React from "react";
import { Lock, Clock, FileCheck, ShieldAlert } from "lucide-react";

export const PrivacyHeader: React.FC = () => {
  return (
    <div className="relative text-center max-w-3xl mx-auto mb-12 sm:mb-16">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm">
        <Lock className="w-4 h-4 text-emerald-400" />
        <span>Data Privacy & Protection</span>
      </div>

      <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
        Privacy{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
          Policy
        </span>
      </h1>

      <p className="text-base sm:text-lg text-slate-400 leading-relaxed mb-6">
        Your privacy and resume security are our highest priorities. Learn how we protect your personal documents,
        encrypt uploaded files, and maintain strict data privacy standards.
      </p>

      <div className="flex items-center justify-center gap-6 text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Last Updated: September 2026</span>
        </div>
        <div className="flex items-center gap-1.5">
          <FileCheck className="w-3.5 h-3.5 text-slate-400" />
          <span>Version 3.1</span>
        </div>
      </div>
    </div>
  );
};

export default PrivacyHeader;
