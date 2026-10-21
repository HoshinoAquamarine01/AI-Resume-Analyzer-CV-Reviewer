import React from "react";
import {
  Target,
  Zap,
  FileCheck,
  FileText,
  MessageSquareCode,
  LayoutGrid,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { Link } from "react-router-dom";

export const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 relative overflow-hidden bg-[#090d16] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <TrendingUp className="w-3.5 h-3.5" />
            Recruiter-Grade Diagnostic Suite
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Engineered to bypass ATS filters. <br className="hidden sm:inline" />
            <span className="saas-highlight-emerald">Built to impress human hiring teams.</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
            Top recruiters spend an average of 6 seconds reviewing a resume. CVPulse ensures every word, metric, and formatting element commands attention.
          </p>
        </div>

        {/* Bento Box Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Bento Card 1 (Span 2 cols on desktop): Multi-Engine ATS Simulator */}
          <div className="lg:col-span-2 saas-card-interactive rounded-3xl p-8 bg-[#0d1322] border border-slate-800/90 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Target className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">Core Engine</span>
                    <h3 className="text-xl font-bold text-white">Multi-ATS Compatibility Scanner</h3>
                  </div>
                </div>
                <span className="hidden sm:inline-flex px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300">
                  Greenhouse &bull; Workday &bull; Taleo
                </span>
              </div>

              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Simulates real-world ATS parser behaviors to detect layout pitfalls, unreadable fonts, missing metadata, and unrecognized experience headers before you submit.
              </p>

              {/* Realistic Simulator Widget */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                  <span className="text-slate-400 font-mono">ATS Parser Diagnostic</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 100% Parsable Hierarchy
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <div className="text-slate-400 text-[11px]">Greenhouse Parser</div>
                    <div className="font-bold text-emerald-400 mt-0.5">Grade A (98/100)</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <div className="text-slate-400 text-[11px]">Workday Scanner</div>
                    <div className="font-bold text-emerald-400 mt-0.5">Zero Table Conflicts</div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <div className="text-slate-400 text-[11px]">Taleo ATS Rulebook</div>
                    <div className="font-bold text-emerald-400 mt-0.5">All Headers Mapped</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Evaluates against 50+ parsing criteria</span>
              <Link to="/ats-match" className="text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center gap-1">
                Run ATS Test <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Bento Card 2: Action-Impact Bullet Polish */}
          <div className="saas-card-interactive rounded-3xl p-8 bg-[#0d1322] border border-slate-800/90 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Line-by-Line Impact Formula</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Replaces passive duties ("Responsible for...") with high-converting executive action verbs and metric anchors (XYZ format).
              </p>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                <div className="text-slate-400 text-[11px] font-mono">Google XYZ Formula:</div>
                <div className="text-slate-200 font-medium">
                  "Accomplished <span className="text-emerald-400 font-bold">[X]</span> as measured by <span className="text-blue-400 font-bold">[Y]</span>, by doing <span className="text-amber-400 font-bold">[Z]</span>."
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 text-xs font-semibold text-amber-400 flex items-center gap-1.5">
              <span>Eliminates 90% of vague descriptions</span>
            </div>
          </div>

          {/* Bento Card 3: Keyword Gap Matrix */}
          <div className="saas-card-interactive rounded-3xl p-8 bg-[#0d1322] border border-slate-800/90 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-6">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Job Description Gap Radar</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Paste any job vacancy to instantly isolate missing critical hard skills, tool proficiencies, and industry certifications.
              </p>

              <div className="flex flex-wrap gap-1.5 text-[11px]">
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
                  &check; React / TS (High Match)
                </span>
                <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
                  &check; GraphQL
                </span>
                <span className="px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 font-medium">
                  ! Kubernetes (Gap)
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 text-xs font-semibold text-blue-400 flex items-center gap-1.5">
              <span>Weighted TF-IDF relevance scoring</span>
            </div>
          </div>

          {/* Bento Card 4: Executive Formatting & Layout Inspector */}
          <div className="saas-card-interactive rounded-3xl p-8 bg-[#0d1322] border border-slate-800/90 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6">
                <LayoutGrid className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">ATS Formatting & Layout Check</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Detects multi-column tables, unsupported vector graphics, font embedding errors, and margin compression that scramble ATS readers.
              </p>

              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-300">Header Hierarchy</span>
                  <span className="text-emerald-400 font-bold">&check; Valid</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-slate-300">Table & Column Health</span>
                  <span className="text-emerald-400 font-bold">&check; Clean Text Flow</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 text-xs font-semibold text-purple-400 flex items-center gap-1.5">
              <span>Standard 1-column & clean 2-column compliance</span>
            </div>
          </div>

          {/* Bento Card 5: STAR Interview Question Matcher */}
          <div className="saas-card-interactive rounded-3xl p-8 bg-[#0d1322] border border-slate-800/90 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 mb-6">
                <MessageSquareCode className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">STAR Interview Simulation</h3>
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                Generates predictive behavioral interview questions based on the specific claims and project bullets on your submitted resume.
              </p>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 italic">
                "Tell me about when you reduced server latency by 45% under tight deadlines..."
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 text-xs font-semibold text-teal-400 flex items-center gap-1.5">
              <span>Includes structured STAR answer blueprints</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Features;
