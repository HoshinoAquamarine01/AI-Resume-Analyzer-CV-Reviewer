import React from "react";
import { CheckCircle2, AlertCircle, Lightbulb, Trophy, RotateCcw, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import { InterviewSession } from "../../types/interview.types";

interface InterviewFeedbackViewProps {
  session: InterviewSession;
  onRestart: () => void;
}

export const InterviewFeedbackView: React.FC<InterviewFeedbackViewProps> = ({
  session,
  onRestart,
}) => {
  const score = session.score || 0;

  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
    if (s >= 60) return "text-amber-400 border-amber-500/30 bg-amber-500/10";
    return "text-rose-400 border-rose-500/30 bg-rose-500/10";
  };

  const getScoreLabel = (s: number) => {
    if (s >= 80) return "Excellent";
    if (s >= 60) return "Good Job";
    return "Needs Improvement";
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20 text-white">
          <Trophy className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider block mb-1">
            AI Interview Evaluation Summary
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Completed Practice Session for {session.jobTitle || "Candidate"}
          </h2>
        </div>

        <div className="inline-flex flex-col items-center justify-center p-6 rounded-2xl border bg-slate-800/50 backdrop-blur-sm min-w-[200px]">
          <span className="text-xs text-slate-400 font-medium mb-1">Overall Performance Score</span>
          <div className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            {score}<span className="text-2xl text-slate-400">/100</span>
          </div>
          <span className={`mt-2 text-xs font-semibold px-3 py-1 rounded-full border ${getScoreColor(score)}`}>
            {getScoreLabel(score)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-emerald-900/40 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            Key Strengths
          </h3>
          <ul className="space-y-3">
            {(session.strengths && session.strengths.length > 0
              ? session.strengths
              : ["No specific strengths reported."]
            ).map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-slate-300 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-xl border border-amber-900/40 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-400" />
            Areas for Improvement
          </h3>
          <ul className="space-y-3">
            {(session.weaknesses && session.weaknesses.length > 0
              ? session.weaknesses
              : ["No specific areas for improvement reported."]
            ).map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-slate-300 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-slate-900/80 backdrop-blur-xl border border-blue-900/40 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
        <h3 className="text-lg font-bold text-blue-400 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-blue-400" />
          Strategic AI Recommendations
        </h3>
        <div className="space-y-3">
          {(session.generalTips && session.generalTips.length > 0
            ? session.generalTips
            : ["Practice answer structuring and maintain clear pacing."]
          ).map((tip, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-200 text-sm">
              💡 {tip}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          onClick={onRestart}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20"
        >
          <RotateCcw className="w-4 h-4" /> Start New Practice
        </button>

        <Link
          to="/dashboard"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-sm flex items-center justify-center gap-2 transition-all"
        >
          <LayoutDashboard className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default InterviewFeedbackView;
