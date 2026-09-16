import React from "react";
import { FileCheck, Award, Zap, Users } from "lucide-react";

export const AboutStats: React.FC = () => {
  const stats = [
    {
      icon: <FileCheck className="w-6 h-6 text-emerald-400" />,
      value: "50,000+",
      label: "Resumes Analyzed",
      description: "Parsed through machine learning ATS algorithms",
    },
    {
      icon: <Award className="w-6 h-6 text-teal-400" />,
      value: "94.8%",
      label: "ATS Pass Rate Improvement",
      description: "Average interview rate increase post-optimization",
    },
    {
      icon: <Zap className="w-6 h-6 text-cyan-400" />,
      value: "< 3 Seconds",
      label: "Instant Processing",
      description: "Real-time AI analysis & deep keyword extraction",
    },
    {
      icon: <Users className="w-6 h-6 text-emerald-400" />,
      value: "100%",
      label: "Privacy Protected",
      description: "256-bit SSL encryption & isolated AI payloads",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-24 max-w-6xl mx-auto">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/40 hover:bg-slate-900/90 transition-all duration-300 shadow-xl group"
        >
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            {stat.icon}
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight mb-1">
            {stat.value}
          </div>
          <div className="text-sm font-semibold text-emerald-400 mb-1">
            {stat.label}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            {stat.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default AboutStats;
