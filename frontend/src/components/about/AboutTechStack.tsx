import React from "react";
import { Cpu, ShieldCheck, FileCode, Layers, Database, Lock } from "lucide-react";

export const AboutTechStack: React.FC = () => {
  const techItems = [
    {
      icon: <Cpu className="w-5 h-5 text-emerald-400" />,
      name: "Google Gemini 1.5 Pro & OpenAI GPT-4o",
      category: "Generative AI Core",
      description: "Powers deep contextual resume analysis, tailored cover letter drafting, and predictive hiring manager interview questions.",
    },
    {
      icon: <FileCode className="w-5 h-5 text-teal-400" />,
      name: "High-Precision PDF/DOCX Parser",
      category: "Document Parsing Engine",
      description: "Extracts structured text, headers, and bullet points from complex multi-column PDFs without losing format hierarchy.",
    },
    {
      icon: <Database className="w-5 h-5 text-cyan-400" />,
      name: "ATS Keyword Matcher Engine",
      category: "Algorithm & NLP",
      description: "Evaluates hard skills, soft skills, job title hierarchy, and metric-driven impact scores against targeted Job Descriptions (JDs).",
    },
    {
      icon: <Lock className="w-5 h-5 text-emerald-400" />,
      name: "Enterprise Data Isolation",
      category: "Security & Privacy",
      description: "All payload transmissions use 256-bit SSL encryption. Data is never used to train public foundation models.",
    },
  ];

  return (
    <div className="mb-24 max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          Engineered for Accuracy
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-4">
          Powered by Next-Gen AI Technology
        </h2>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Our platform combines industry-standard ATS parsing heuristics with state-of-the-art Large Language Models.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {techItems.map((item, idx) => (
          <div
            key={idx}
            className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/30 transition-all duration-300 shadow-xl flex items-start gap-5"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center shrink-0 shadow-inner">
              {item.icon}
            </div>
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                {item.category}
              </span>
              <h3 className="text-lg font-bold text-white">
                {item.name}
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

export default AboutTechStack;
