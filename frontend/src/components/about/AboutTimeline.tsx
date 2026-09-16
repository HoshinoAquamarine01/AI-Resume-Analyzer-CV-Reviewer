import React from "react";
import { CheckCircle2, Rocket, Flag, Layers } from "lucide-react";

export const AboutTimeline: React.FC = () => {
  const milestones = [
    {
      quarter: "Q1 2024",
      title: "Core ATS Engine v1 Launch",
      description: "Implemented text extraction for PDF/DOCX and introduced deterministic keyword matching algorithms.",
    },
    {
      quarter: "Q3 2024",
      title: "Gemini & GPT-4o AI Integration",
      description: "Enhanced scoring accuracy with AI contextual feedback, action verb metrics, and section-by-section CV breakdown.",
    },
    {
      quarter: "Q1 2025",
      title: "Cover Letter & Interview Copilot",
      description: "Added AI-driven personalized cover letter generation and job-specific interview question predictions.",
    },
    {
      quarter: "Q3 2025 & Beyond",
      title: "Enterprise Privacy & Multilingual ATS",
      description: "Expanded support to global languages, enterprise security compliance, and direct ATS simulation benchmarks.",
    },
  ];

  return (
    <div className="mb-24 max-w-4xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Rocket className="w-3.5 h-3.5 text-emerald-400" />
          Our Journey
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-4">
          Development Milestones
        </h2>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Continuously evolving to deliver the most accurate career optimization platform.
        </p>
      </div>

      <div className="relative border-l-2 border-slate-800 ml-4 sm:ml-32 space-y-10">
        {milestones.map((item, idx) => (
          <div key={idx} className="relative pl-6 sm:pl-8 group">
           
            <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-emerald-400 group-hover:bg-emerald-400 transition-colors shadow-md shadow-emerald-950" />

         
            <span className="hidden sm:block absolute -left-32 top-1 text-xs font-bold text-emerald-400 tracking-wider w-24 text-right">
              {item.quarter}
            </span>

           
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all duration-200">
              <span className="sm:hidden inline-block text-xs font-bold text-emerald-400 mb-2">
                {item.quarter}
              </span>
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                {item.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutTimeline;
