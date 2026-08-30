import React from "react";
import { ShieldCheck, Zap, AlertTriangle, CheckCircle2, AlertCircle, Lightbulb } from "lucide-react";

interface ResumeScoreOverviewProps {
  score?: number;
  strengthsCount?: number;
  weaknessesCount?: number;
  recommendationsCount?: number;
}

export const ResumeScoreOverview: React.FC<ResumeScoreOverviewProps> = ({
  score = 0,
  strengthsCount = 0,
  weaknessesCount = 0,
  recommendationsCount = 0,
}) => {
  const getBadgeDetails = (s: number) => {
    if (s >= 80) {
      return {
        label: "Excellent Quality",
        color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
        icon: ShieldCheck,
        description: "Your resume is well formatted with high keyword density and strong impact statements!",
      };
    }
    if (s >= 60) {
      return {
        label: "Good Foundation",
        color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
        icon: Zap,
        description: "Decent structure, but implementing AI recommendations will improve response rates.",
      };
    }
    return {
      label: "Needs Optimization",
      color: "text-rose-400 bg-rose-500/10 border-rose-500/30",
      icon: AlertTriangle,
      description: "Significant optimization needed. Review flagged issues and actionable suggestions below.",
    };
  };

  const badge = getBadgeDetails(score);
  const BadgeIcon = badge.icon;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      
      <div className="absolute -top-12 -right-12 w-44 h-44 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
       
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="w-36 h-36 transform -rotate-90">
            <circle
              cx="72"
              cy="72"
              r="58"
              stroke="currentColor"
              strokeWidth="10"
              className="text-slate-800/80"
              fill="transparent"
            />
            <circle
              cx="72"
              cy="72"
              r="58"
              stroke="currentColor"
              strokeWidth="10"
              strokeDasharray={364.42}
              strokeDashoffset={364.42 - (364.42 * score) / 100}
              strokeLinecap="round"
              className={`transition-all duration-1000 ease-out ${
                score >= 80 ? "text-emerald-500" : score >= 60 ? "text-amber-500" : "text-rose-500"
              }`}
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-black text-white tracking-tight">{score}%</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
              AI Score
            </span>
          </div>
        </div>

        
        <div className="flex-1 space-y-4 text-center md:text-left w-full">
          <div>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badge.color} mb-2`}>
              <BadgeIcon className="w-4 h-4" />
              <span>{badge.label}</span>
            </div>
            <p className="text-slate-300 text-sm">{badge.description}</p>
          </div>

          
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-3 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs text-slate-400 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Strengths</span>
              </div>
              <span className="text-xl font-extrabold text-emerald-400">{strengthsCount}</span>
            </div>

            <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-3 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs text-slate-400 mb-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Issues</span>
              </div>
              <span className="text-xl font-extrabold text-amber-400">{weaknessesCount}</span>
            </div>

            <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-3 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs text-slate-400 mb-1">
                <Lightbulb className="w-3.5 h-3.5 text-blue-400" />
                <span>Suggestions</span>
              </div>
              <span className="text-xl font-extrabold text-blue-400">{recommendationsCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeScoreOverview;
