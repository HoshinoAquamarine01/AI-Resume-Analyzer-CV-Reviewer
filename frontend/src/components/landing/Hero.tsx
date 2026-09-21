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
  Target,
  BarChart3,
} from "lucide-react";

export const Hero: React.FC = () => {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      
      <div className="glow-effect w-[500px] h-[500px] bg-blue-900/40 top-0 left-1/2 -translate-x-1/2"></div>
      <div className="glow-effect w-[400px] h-[400px] bg-emerald-900/30 top-32 right-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/90 border border-slate-700 text-emerald-400 text-xs sm:text-sm font-medium shadow-sm">
            <Target className="w-4 h-4 text-emerald-400" />
            <span>Advanced ATS Parsing & Job Alignment Engine v3.2</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
            Land Your Dream Job <br className="hidden sm:inline" />
            <span className="text-gradient">3x Faster</span> with Resume Intelligence
          </h1>

          <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
            Beat Applicant Tracking Systems (ATS), eliminate weak bullets, and receive line-by-line expert feedback tailored to top job descriptions in seconds.
          </p>

          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-base rounded-xl shadow-xl shadow-emerald-950/60 hover:shadow-emerald-600/30 transition-all flex items-center justify-center gap-2.5 group active:scale-95"
            >
              <span>Analyze My Resume</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#preview"
              className="w-full sm:w-auto px-6 py-4 bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-medium text-base rounded-xl transition-all border border-slate-700/80 flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4 text-slate-400" />
              <span>View Sample Audit</span>
            </a>
          </div>

          <div className="pt-2 flex items-center justify-center gap-6 text-xs sm:text-sm text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Confidential & Secure</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span>No Credit Card Needed</span>
            </div>
          </div>
        </div>

        <div className="mt-14 max-w-4xl mx-auto relative">
          <div className="p-1 rounded-3xl bg-slate-800/60 border border-slate-700/60 shadow-2xl">
            <div className="glass-panel rounded-[22px] p-6 sm:p-10 text-center border border-slate-800">
              
              <div className="border-2 border-dashed border-slate-700 hover:border-emerald-500/80 rounded-2xl p-8 sm:p-12 transition-all bg-slate-900/60 group cursor-pointer">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-all">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1.5">
                  Drop your resume here or click to browse
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-6">
                  Supports PDF, DOCX, or TXT (Max size 10MB). Encrypted and private.
                </p>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-xl transition-all shadow-md"
                >
                  <FileText className="w-4 h-4" />
                  Select File & Analyze
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-xs text-slate-400">ATS Match Score</div>
                  <div className="text-lg font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                    <TrendingUp className="w-4 h-4" /> 94/100
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-xs text-slate-400">Analysis Speed</div>
                  <div className="text-lg font-bold text-blue-400 mt-0.5">
                    &lt; 5 Seconds
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-xs text-slate-400">Action Verbs Check</div>
                  <div className="text-lg font-bold text-teal-400 mt-0.5">
                    +42% Impact
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-xs text-slate-400">User Rating</div>
                  <div className="text-lg font-bold text-amber-400 flex items-center gap-1 mt-0.5">
                    <Star className="w-4 h-4 fill-amber-400" /> 4.9 / 5.0
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
