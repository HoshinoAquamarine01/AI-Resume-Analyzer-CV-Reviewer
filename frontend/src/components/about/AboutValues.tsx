import React from "react";
import { ShieldCheck, HeartHandshake, Lightbulb, Target } from "lucide-react";

export const AboutValues: React.FC = () => {
  const values = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      title: "Uncompromising Privacy",
      description: "We treat candidate data like our own. Your CV is encrypted, private, and never monetized.",
    },
    {
      icon: <Target className="w-6 h-6 text-teal-400" />,
      title: "Data-Driven Precision",
      description: "No vague advice. Every score and recommendation is backed by real ATS parser benchmarks.",
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-cyan-400" />,
      title: "Equal Opportunity",
      description: "Democratizing career advancement tools so candidates from any background can land top roles.",
    },
    {
      icon: <Lightbulb className="w-6 h-6 text-emerald-400" />,
      title: "Continuous AI Innovation",
      description: "Rapidly incorporating the latest generative AI and recruiter feedback loops into our product.",
    },
  ];

  return (
    <div className="mb-24 max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-extrabold text-white tracking-tight mb-4">
          Our Core Principles
        </h2>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          The values that guide every line of code we write and feature we build.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {values.map((v, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800/80 hover:border-emerald-500/30 hover:bg-slate-900/80 transition-all duration-300 shadow-lg text-center"
          >
            <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-800 border border-slate-700/80 flex items-center justify-center mb-4">
              {v.icon}
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              {v.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {v.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutValues;
