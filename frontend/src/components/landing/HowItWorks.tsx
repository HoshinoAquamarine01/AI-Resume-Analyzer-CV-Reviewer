import React from "react";
import { Upload, FileSearch, Award, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: "01",
      icon: <Upload className="w-6 h-6 text-blue-400" />,
      title: "Upload Resume & Target Role",
      description:
        "Upload your existing resume in PDF or DOCX format. Optionally paste the job description for the specific position you want to target.",
      badge: "Instant 1-Click Upload",
    },
    {
      step: "02",
      icon: <FileSearch className="w-6 h-6 text-emerald-400" />,
      title: "Run Deep ATS Diagnostic",
      description:
        "Our engine scans your resume against real-world ATS filter criteria (Taleo, Greenhouse, Workday), flagging missing keywords, layout flaws, and weak bullets.",
      badge: "< 4s Multi-Section Scan",
    },
    {
      step: "03",
      icon: <Award className="w-6 h-6 text-amber-400" />,
      title: "Refine, Export & Land Interviews",
      description:
        "Accept line-by-line bullet upgrades, fill keyword gaps with recruiter-crafted action phrasing, and export a clean, ATS-compliant CV.",
      badge: "3x More Callbacks",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden bg-[#090d16] scroll-mt-20 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase bg-slate-900 border border-slate-800 px-3.5 py-1 rounded-full">
            Streamlined 3-Step Process
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            How <span className="saas-highlight-emerald">CVPulse</span> works
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            From overlooked application to recruiter shortlist in less than three minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((s, index) => (
            <div
              key={index}
              className="saas-card-interactive rounded-3xl p-8 bg-[#0d1322] border border-slate-800/90 relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center shadow-md">
                    {s.icon}
                  </div>
                  <span className="text-4xl font-black text-slate-800 font-mono">
                    {s.step}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3">
                  {s.title}
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  {s.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>{s.badge}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-950/40 transition-all active:scale-95"
          >
            <span>Start Your Free Scan</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default HowItWorks;
