import React from "react";
import { Upload, Cpu, Award, Check } from "lucide-react";

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: "01",
      icon: <Upload className="w-6 h-6 text-blue-400" />,
      title: "Upload Your Resume",
      description:
        "Drag and drop your existing PDF or Word document into our secure parser. Optionally paste your target Job Description.",
      badge: "Fast 1-Click Upload",
    },
    {
      step: "02",
      icon: <Cpu className="w-6 h-6 text-cyan-400" />,
      title: "Automated 360° Audit",
      description:
        "Our engine evaluates ATS compatibility, keyword density, action metrics, formatting errors, and impact scores.",
      badge: "< 5 Sec Processing",
    },
    {
      step: "03",
      icon: <Award className="w-6 h-6 text-emerald-400" />,
      title: "Apply Fixes & Win Offers",
      description:
        "Implement tailored bullet-point rewrites, export your polished CV, and start landing 3x more interview callbacks.",
      badge: "Instant Results",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            Simple 3-Step Process
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            How <span className="text-gradient">CVPulse</span> Works
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Transform your resume from overlooked to outstanding in less than two minutes.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((s, index) => (
            <div
              key={index}
              className="glass-panel rounded-3xl p-8 border border-slate-800 relative hover:border-slate-700 transition-all group flex flex-col justify-between"
            >
              <div>
                {/* Step Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                    {s.icon}
                  </div>
                  <span className="text-4xl font-black text-slate-700 group-hover:text-emerald-500/40 transition-colors">
                    {s.step}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                  {s.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  {s.description}
                </p>
              </div>

              {/* Step Footer Badge */}
              <div className="pt-4 border-t border-slate-800 flex items-center gap-2 text-xs font-medium text-emerald-400">
                <Check className="w-4 h-4" />
                <span>{s.badge}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
