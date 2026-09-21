import React, { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  FileSpreadsheet,
  Zap,
  RefreshCw,
  FileCheck,
} from "lucide-react";

export const AiAnalysisPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"ats" | "bullets" | "keywords">("ats");

  return (
    <section id="preview" className="py-24 relative overflow-hidden bg-slate-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            Interactive Product Audit Preview
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            See Your <span className="text-gradient">Detailed Resume Report</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Experience the exact actionable insights, scores, and bullet-point upgrades generated for your resume.
          </p>
        </div>

        <div className="flex justify-center mb-10">
          <div className="p-1.5 glass-panel rounded-2xl flex flex-wrap justify-center gap-2 border border-slate-800">
            <button
              onClick={() => setActiveTab("ats")}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === "ats"
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950/50"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              ATS Score Breakdown
            </button>
            <button
              onClick={() => setActiveTab("bullets")}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === "bullets"
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950/50"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              Before vs. After Rewriter
            </button>
            <button
              onClick={() => setActiveTab("keywords")}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === "keywords"
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-950/50"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              Keyword Gap Analysis
            </button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto glass-panel rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl">
          
          {activeTab === "ats" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              
              <div className="glass-card rounded-2xl p-8 text-center border border-slate-800 flex flex-col items-center justify-center">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-800"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-emerald-500"
                      strokeDasharray="92, 100"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-extrabold text-white">92</span>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                      Excellent
                    </span>
                  </div>
                </div>
                <h4 className="mt-4 font-bold text-white text-base">Overall Resume Health</h4>
                <p className="text-xs text-slate-400 mt-1">Target Role: Senior Full Stack Engineer</p>
              </div>

              <div className="md:col-span-2 space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-slate-200">ATS Keyword Match</span>
                    <span className="font-bold text-emerald-400">95%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full w-[95%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-slate-200">Impact & Quantifiable Metrics</span>
                    <span className="font-bold text-cyan-400">88%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-cyan-500 h-full rounded-full w-[88%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-slate-200">Format & Section Layout</span>
                    <span className="font-bold text-blue-400">98%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full w-[98%]"></div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
                  <Zap className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Audit Recommendation:</strong> Add 2 quantifiable metrics to your recent role at Acme Corp to increase interview selection rate by up to 34%.
                  </span>
                </div>
              </div>

            </div>
          )}

          {activeTab === "bullets" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" /> Before (Weak)
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">Impact Rating: 3/10</span>
                  </div>
                  <p className="text-sm text-slate-300 italic leading-relaxed">
                    "Managed a team of developers and worked on backend APIs for our web application."
                  </p>
                  <div className="mt-4 text-xs text-red-400/90 flex items-center gap-1">
                    <span>❌ Lacks action verbs & measurable outcome metrics</span>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Optimized Bullet (High Impact)
                    </span>
                    <span className="text-[11px] text-emerald-400 font-mono font-bold">Impact Rating: 9.8/10</span>
                  </div>
                  <p className="text-sm text-slate-100 font-medium leading-relaxed">
                    "Spearheaded a high-performing team of 8 engineers to architect microservices APIs, reducing server latency by 45% and supporting 1.2M daily active users."
                  </p>
                  <div className="mt-4 text-xs text-emerald-400 font-medium flex items-center gap-1">
                    <FileCheck className="w-4 h-4" />
                    <span>Action verbs + Quantifiable business impact included</span>
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === "keywords" && (
            <div className="space-y-6">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <span>Required Skills Found in Target Job Posting</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/30 flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">React.js / TypeScript</span>
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">Matched</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/30 flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">RESTful APIs & GraphQL</span>
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">Matched</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-amber-500/30 flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">Docker / Kubernetes</span>
                  <span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded">Missing</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/30 flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">CI/CD Pipeline Automation</span>
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">Matched</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-amber-500/30 flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">Microservice Architecture</span>
                  <span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded">Missing</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/30 flex items-center justify-between text-xs">
                  <span className="font-semibold text-white">PostgreSQL & Redis</span>
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">Matched</span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};

export default AiAnalysisPreview;
