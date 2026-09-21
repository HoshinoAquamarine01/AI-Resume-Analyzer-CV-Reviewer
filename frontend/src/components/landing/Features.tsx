import React from "react";
import {
  Target,
  Zap,
  FileCheck,
  FileText,
  MessageSquareCode,
  LayoutGrid,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";

interface FeatureItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  tag: string;
}

const featuresList: FeatureItem[] = [
  {
    icon: <Target className="w-6 h-6 text-emerald-400" />,
    title: "ATS Compatibility & Keyword Matching",
    description:
      "Pass Taleo, Workday, and Greenhouse ATS filters with high precision keyword match analysis tailored to your target industry.",
    tag: "ATS Optimization",
  },
  {
    icon: <Zap className="w-6 h-6 text-amber-400" />,
    title: "Instant Line-by-Line Critique",
    description:
      "Receive detailed action verb recommendations, grammar fixes, and impact metrics for every single bullet point in seconds.",
    tag: "Resume Audit",
  },
  {
    icon: <FileCheck className="w-6 h-6 text-blue-400" />,
    title: "Job Description Alignment",
    description:
      "Paste any job posting URL or text to get a 0-100% Match Score along with missing skill gaps highlighted instantly.",
    tag: "Job Match",
  },
  {
    icon: <FileText className="w-6 h-6 text-teal-400" />,
    title: "Tailored Cover Letter Generator",
    description:
      "Generate structured, high-converting cover letters perfectly aligned with your resume experience and target job requirements.",
    tag: "Cover Letter",
  },
  {
    icon: <MessageSquareCode className="w-6 h-6 text-cyan-400" />,
    title: "Interview Q&A Predictor",
    description:
      "Get predicted interview questions and STAR-method answer templates tailored to the experience listed on your CV.",
    tag: "Interview Prep",
  },
  {
    icon: <LayoutGrid className="w-6 h-6 text-indigo-400" />,
    title: "ATS Format & Layout Inspector",
    description:
      "Automatically detect parsing errors, complex tables, unreadable fonts, or illegal formatting that confuse ATS parsers.",
    tag: "Parsing Check",
  },
];

export const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 relative overflow-hidden bg-slate-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <TrendingUp className="w-3.5 h-3.5" />
            Cutting-Edge Career Tools
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Everything You Need to <span className="text-gradient">Stand Out</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-400">
            Our analysis engine evaluates thousands of successful executive resumes to optimize your CV for maximum interview callbacks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresList.map((item, idx) => (
            <div
              key={idx}
              className="glass-card rounded-2xl p-8 hover:border-emerald-500/40 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {item.icon}
                  </div>
                  <span className="text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center text-xs font-semibold text-emerald-400">
                <ShieldCheck className="w-4 h-4 mr-1.5" />
                <span>Included in Free Audit</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;
