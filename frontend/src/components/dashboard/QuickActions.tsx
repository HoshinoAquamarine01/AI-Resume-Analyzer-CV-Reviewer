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
      badge: "Fast Scan",
      gradient: "from-blue-600/20 to-indigo-600/20",
      borderColor: "border-blue-500/30",
      iconColor: "text-blue-400",
    },
    {
      title: "ATS Job Alignment",
      description: "Paste a Job Description to check keyword match & gap analysis.",
      link: "/ats-match",
      icon: Target,
      badge: "AI Powered",
      gradient: "from-emerald-600/20 to-teal-600/20",
      borderColor: "border-emerald-500/30",
      iconColor: "text-emerald-400",
    },
    {
      title: "Generate Cover Letter",
      description: "Write compelling, personalized application letters in seconds.",
      link: "/cover-letter",
      icon: FileEdit,
      badge: "1-Click",
      gradient: "from-purple-600/20 to-pink-600/20",
      borderColor: "border-purple-500/30",
      iconColor: "text-purple-400",
    },
    {
      title: "Mock AI Interview",
      description: "Practice role-specific interview questions & get live feedback.",
      link: "/interview",
      icon: MessageSquare,
      badge: "Interactive",
      gradient: "from-amber-600/20 to-orange-600/20",
      borderColor: "border-amber-500/30",
      iconColor: "text-amber-400",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          Quick Actions & Tools
        </h3>
        <span className="text-xs text-slate-400">Choose a tool to get started</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <Link
              key={idx}
              to={action.link}
              className={`p-5 rounded-2xl bg-gradient-to-b ${action.gradient} bg-[#0d1322]/90 border ${action.borderColor} hover:border-slate-600 transition-all duration-300 group flex flex-col justify-between hover:shadow-xl hover:translate-y-[-2px]`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2.5 rounded-xl bg-slate-900/80 ${action.iconColor} border border-slate-800`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 text-[10px] font-semibold text-slate-300 bg-slate-800/80 rounded-full border border-slate-700/60">
                    {action.badge}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                  {action.title}
                </h4>

                <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                  {action.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-slate-300 group-hover:text-white">
                <span>Start Now</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-blue-400 transition-all" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
