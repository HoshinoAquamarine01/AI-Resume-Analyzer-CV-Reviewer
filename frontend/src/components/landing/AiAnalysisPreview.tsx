import React, { useState } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  FileSpreadsheet,
  Zap,
  RefreshCw,
  FileCheck,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

export const AiAnalysisPreview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"ats" | "bullets" | "keywords">("ats");

  return (
    <section id="preview" className="py-24 relative overflow-hidden bg-[#090d16] scroll-mt-20 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase bg-slate-900 border border-slate-800 px-3.5 py-1 rounded-full">
            Real Recruiter Audit Sample
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            See the exact report <br className="hidden sm:inline" />
            <span className="saas-highlight-emerald">hiring managers would see.</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Every audit delivers concrete, line-by-line recommendations—not vague automated generic praise.
          </p>
        </div>

        {/* Tab Controls (Sleek SaaS Segmented Control) */}
        <div className="flex justify-center mb-10">
          <div className="p-1.5 bg-[#0d1322] rounded-2xl flex flex-wrap justify-center gap-2 border border-slate-800 shadow-lg">
            <button
              onClick={() => setActiveTab("ats")}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "ats"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/40"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              ATS Diagnostic Breakdown
            </button>
            <button
              onClick={() => setActiveTab("bullets")}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "bullets"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/40"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              Before & After Bullet Rewriter
            </button>
            <button
              onClick={() => setActiveTab("keywords")}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "keywords"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/40"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              Target Keyword Gap Matrix
            </button>
          </div>
        </div>

        {/* Audit Report Container */}
        <div className="max-w-5xl mx-auto saas-card rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl bg-[#0d1322]">
          
          {/* TAB 1: ATS SCORE BREAKDOWN */}
          {activeTab === "ats" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              
              <div className="p-8 rounded-2xl bg-[#090d16] border border-slate-800/80 flex flex-col items-center justify-center text-center">
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
                      strokeDasharray="94, 100"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-extrabold text-white">94</span>
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                      Recruiter Ready
                    </span>
                  </div>
                </div>
                <h4 className="mt-4 font-bold text-white text-base">Alex Tran</h4>
                <p className="text-xs text-slate-400 mt-0.5">Target: Lead Full-Stack Engineer</p>
                <span className="mt-3 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[11px] font-semibold border border-emerald-500/20">
                  Top 5% Candidate Benchmark
                </span>
              </div>

              <div className="md:col-span-2 space-y-5">
                <div>
                  <div className="flex justify-between text-xs sm:text-sm mb-2">
                    <span className="font-semibold text-slate-200">ATS Keyword Density & Hard Skills</span>
                    <span className="font-bold text-emerald-400">95% (Excellent)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full w-[95%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs sm:text-sm mb-2">
                    <span className="font-semibold text-slate-200">Quantifiable Metrics & Outcome Anchors</span>
                    <span className="font-bold text-blue-400">90% (Strong)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full w-[90%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs sm:text-sm mb-2">
                    <span className="font-semibold text-slate-200">Layout & Section Formatting Health</span>
                    <span className="font-bold text-teal-400">98% (Pass)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-teal-500 h-full rounded-full w-[98%]"></div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <strong className="text-white">Recruiter Summary:</strong> Strong technical depth and clean typography. Replaced 2 passive bullet points with quantifiable performance gains, boosting estimated recruiter callback likelihood by 38%.
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: BEFORE VS AFTER REWRITER */}
          {activeTab === "bullets" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* BEFORE CARD */}
                <div className="p-6 rounded-2xl bg-[#140f12] border border-red-500/30 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-red-500/20">
                      <span className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" /> Before Optimization
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">Impact Score: 3.5 / 10</span>
                    </div>
                    <p className="text-sm text-slate-300 italic leading-relaxed">
                      "Responsible for managing backend APIs, fixing bug tickets, and attending agile meetings with team members."
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-red-500/10 text-xs text-red-300 space-y-1">
                    <div className="font-semibold">Recruiter Red Flags:</div>
                    <div>&bull; Uses passive "Responsible for" instead of leadership verbs</div>
                    <div>&bull; Zero measurable metrics (no %, $, or latency improvements)</div>
                  </div>
                </div>

                {/* AFTER CARD */}
                <div className="p-6 rounded-2xl bg-[#091512] border border-emerald-500/40 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-emerald-500/20">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Recruiter-Grade Rewrite
                      </span>
                      <span className="text-[11px] text-emerald-400 font-mono font-bold">Impact Score: 9.7 / 10</span>
                    </div>
                    <p className="text-sm text-slate-100 font-medium leading-relaxed">
                      "Architected high-throughput NestJS microservices APIs handling 1.2M daily requests, cutting average query latency by 42% and preventing $85k in cloud over-provisioning."
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-emerald-500/10 text-xs text-emerald-300 space-y-1">
                    <div className="font-semibold">Why this works:</div>
                    <div>&bull; Direct action verb ("Architected"), clear scale (1.2M req/day)</div>
                    <div>&bull; Proven business ROI (42% latency cut, $85k saved)</div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: KEYWORD GAP MATRIX */}
          {activeTab === "keywords" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                <h4 className="text-sm font-bold text-white">
                  Target Job: Senior Software Engineer (Fintech & Payments)
                </h4>
                <span className="text-xs text-slate-400">
                  Target Match: <strong className="text-emerald-400">88% Aligned</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">TypeScript & React 18</span>
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Matched</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">PostgreSQL / SQL Tuning</span>
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Matched</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-amber-500/30 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">Kafka / Message Queue</span>
                  <span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">Missing</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">Microservice Architecture</span>
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Matched</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-amber-500/30 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">Docker & Kubernetes</span>
                  <span className="text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">Missing</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">PCI-DSS / Security Basics</span>
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Matched</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400">
                <strong className="text-slate-200">Action Tip:</strong> Add 1-2 examples where you deployed containerized services or handled async messaging to push your match rate above 95%.
              </div>
            </div>
          )}

          {/* Bottom Action CTA */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <span className="text-slate-400">Ready to see how your own resume scores?</span>
            <Link
              to="/dashboard"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <span>Scan My Resume Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
};

export default AiAnalysisPreview;
