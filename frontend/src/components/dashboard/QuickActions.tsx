import React from "react";
import { Link } from "react-router-dom";
import { FileUp, Target, FileEdit, MessageSquare, ArrowRight } from "lucide-react";

export const QuickActions: React.FC = () => {
  const actions = [
    {
      title: "Upload & Audit CV",
      description: "Extract text, format sections, and get instant score breakdown.",
      link: "/resumes",
      icon: FileUp,
      badge: "Fast Diagnostic",
      iconColor: "text-blue-400",
      iconBg: "bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "ATS Job Alignment",
      description: "Paste a Job Description to check keyword match & gap analysis.",
      link: "/ats-match",
      icon: Target,
      badge: "Match Engine",
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Targeted Cover Letter",
      description: "Write compelling, personalized application letters tailored to the JD.",
      link: "/cover-letter",
      icon: FileEdit,
      badge: "Tailored",
      iconColor: "text-teal-400",
      iconBg: "bg-teal-500/10 border-teal-500/20",
    },
    {
      title: "Mock Interview Prep",
      description: "Practice role-specific interview questions & get STAR-method feedback.",
      link: "/interview",
      icon: MessageSquare,
      badge: "STAR Method",
      iconColor: "text-amber-400",
      iconBg: "bg-amber-500/10 border-amber-500/20",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Candidate Optimization Toolkit
        </h3>
        <span className="text-xs text-slate-400">Choose a tool to accelerate your search</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <Link
              key={idx}
              to={action.link}
              className="saas-card-interactive p-5 rounded-2xl bg-[#0d1322] border border-slate-800/90 hover:border-slate-700 transition-all duration-200 group flex flex-col justify-between shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-xl border ${action.iconBg} ${action.iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 text-[10px] font-semibold text-slate-300 bg-slate-900 rounded-full border border-slate-800">
                    {action.badge}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {action.title}
                </h4>

                <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {action.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-slate-300 group-hover:text-white">
                <span>Launch Tool</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-emerald-400 transition-all" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
