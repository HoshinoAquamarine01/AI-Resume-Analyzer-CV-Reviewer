import React from "react";
import { ShieldCheck, Zap, AlertTriangle } from "lucide-react";

interface AtsScoreGaugeProps {
  score: number;
  matchedCount: number;
  missingCount: number;
}

export const AtsScoreGauge: React.FC<AtsScoreGaugeProps> = ({
  score,
  matchedCount,
  missingCount,
}) => {
  const getBadgeDetails = (score: number) => {
    if (score >= 80) {
      return {
        label: "Excellent Fit",
        color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
        icon: ShieldCheck,
        description: "Your resume is highly optimized for this job description!",
      };
    }
    if (score >= 60) {
      return {
        label: "Moderate Fit",
        color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
        icon: Zap,
        description: "Good alignment, but adding missing keywords will increase interview chances.",
      };
    }
    return {
      label: "Needs Improvement",
      color: "text-rose-400 bg-rose-500/10 border-rose-500/30",
      icon: AlertTriangle,
      description: "Significant keyword gap detected. Incorporate missing skills below.",
    };
  };

  const badge = getBadgeDetails(score);
  const BadgeIcon = badge.icon;

  const totalKeywords = matchedCount + missingCount;
  const matchPercentage = totalKeywords > 0 ? Math.round((matchedCount / totalKeywords) * 100) : 0;

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">

      <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
     
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="52"
              stroke="currentColor"
              strokeWidth="10"
              className="text-slate-800"
              fill="transparent"
            />
            <circle
              cx="64"
              cy="64"
              r="52"
              stroke="currentColor"
              strokeWidth="10"
              strokeDasharray={326.72}
              strokeDashoffset={326.72 - (326.72 * score) / 100}
              strokeLinecap="round"
              className={`transition-all duration-1000 ease-out ${
                score >= 80 ? "text-emerald-500" : score >= 60 ? "text-amber-500" : "text-rose-500"
              }`}
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-extrabold text-white tracking-tight">{score}%</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
              ATS Score
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-3 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badge.color}`}>
              <BadgeIcon className="w-3.5 h-3.5" />
              <span>{badge.label}</span>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              Keyword Density Match: {matchPercentage}%
            </span>
          </div>

          <p className="text-slate-300 text-sm">{badge.description}</p>

       
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/60">
            <div className="bg-slate-800/40 rounded-xl p-2.5 text-center sm:text-left">
              <span className="text-xs text-slate-400 block">Matched Keywords</span>
              <span className="text-lg font-bold text-emerald-400">{matchedCount}</span>
            </div>
            <div className="bg-slate-800/40 rounded-xl p-2.5 text-center sm:text-left">
              <span className="text-xs text-slate-400 block">Missing Keywords</span>
              <span className="text-lg font-bold text-rose-400">{missingCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AtsScoreGauge;
