import React from "react";
import { Link } from "react-router-dom";
import {
  UploadCloud,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Star,
  FileText,
  TrendingUp,
  Sparkles,
  Award,
  Layers,
  Building2,
} from "lucide-react";

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bento-pattern-bg">
      {/* Subtle, refined atmospheric lighting */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          {/* Professional Status Pill (Anti-AI Cliché) */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs sm:text-sm font-medium shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-slate-200 font-semibold">Taleo, Greenhouse & Workday Compatible</span>
            <span className="text-slate-500">•</span>
            <span className="text-emerald-400 font-medium">ATS v2026 Ready</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
            Stop getting rejected by ATS. <br className="hidden sm:inline" />
            <span className="text-white">Get hired with </span>
            <span className="saas-highlight-emerald">Recruiter Intelligence.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
            75% of resumes are discarded before a human recruiter ever sees them. CVPulse identifies keyword gaps, fixes weak bullet points, and formats your CV for guaranteed readability.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-base rounded-xl shadow-lg shadow-emerald-950/40 hover:shadow-emerald-600/25 transition-all flex items-center justify-center gap-2.5 group active:scale-[0.98]"
            >
              <span>Scan My Resume Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#preview"
              className="w-full sm:w-auto px-6 py-4 bg-slate-900 hover:bg-slate-800 text-slate-200 font-medium text-base rounded-xl transition-all border border-slate-800 hover:border-slate-700 flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4 text-slate-400" />
              <span>Explore Interactive Audit</span>
            </a>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Confidential & Encrypted</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Scored against 120+ Tech & Business Roles</span>
            </div>
          </div>
        </div>

        {/* Product Showcase Bento Card (Tangible & Professional) */}
        <div className="mt-14 max-w-4xl mx-auto relative">
          <div className="saas-card rounded-3xl p-2 sm:p-3 border border-slate-800 shadow-2xl">
            <div className="bg-[#0b101d] rounded-2xl p-6 sm:p-8 border border-slate-800/80">
              
              {/* Dropzone Container */}
              <div className="border-2 border-dashed border-slate-700/80 hover:border-emerald-500/70 rounded-2xl p-8 sm:p-10 transition-all bg-[#090d16]/70 group text-center cursor-pointer">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-all">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1.5">
                  Drag & Drop your resume to start instant audit
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-6">
                  Supports standard PDF and DOCX formats. Never shared or used for training without consent.
                </p>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-xl transition-all shadow-md active:scale-95"
                >
                  <FileText className="w-4 h-4" />
                  Select Resume File
                </Link>
              </div>

              {/* Realistic Recruiter Metrics (Clean & Trustworthy) */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-left">
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/90">
                  <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">ATS Pass Rate</div>
                  <div className="text-xl font-extrabold text-emerald-400 flex items-center gap-1.5 mt-1">
                    <TrendingUp className="w-4 h-4" /> 94.8%
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Top-quartile candidate score</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/90">
                  <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Audit Speed</div>
                  <div className="text-xl font-extrabold text-blue-400 mt-1">
                    &lt; 3.2s
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Full multi-section parse</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/90">
                  <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Action Verb Ratio</div>
                  <div className="text-xl font-extrabold text-teal-400 mt-1">
                    +48% Impact
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">XYZ formula optimization</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/90">
                  <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Recruiter Rating</div>
                  <div className="text-xl font-extrabold text-amber-400 flex items-center gap-1 mt-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> 4.9 / 5.0
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">From 45,000+ applicants</div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Company Social Proof Strip */}
        <div className="mt-16 text-center">
          <p className="text-xs uppercase tracking-widest text-slate-500 font-medium mb-6">
            Candidates optimized with CVPulse hired at leading enterprises
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 opacity-60 grayscale hover:grayscale-0 transition-all text-slate-300 font-semibold text-sm">
            <span className="flex items-center gap-2"><Building2 className="w-4 h-4 text-slate-400" /> Google</span>
            <span className="flex items-center gap-2"><Building2 className="w-4 h-4 text-slate-400" /> Microsoft</span>
            <span className="flex items-center gap-2"><Building2 className="w-4 h-4 text-slate-400" /> Amazon</span>
            <span className="flex items-center gap-2"><Building2 className="w-4 h-4 text-slate-400" /> Shopee</span>
            <span className="flex items-center gap-2"><Building2 className="w-4 h-4 text-slate-400" /> Grab</span>
            <span className="flex items-center gap-2"><Building2 className="w-4 h-4 text-slate-400" /> VNG Corp</span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
