import React from "react";
import { Lightbulb, CheckCircle, ChevronRight } from "lucide-react";

interface AtsSuggestionsListProps {
  suggestions: string[];
}

export const AtsSuggestionsList: React.FC<AtsSuggestionsListProps> = ({ suggestions }) => {
  if (!suggestions || suggestions.length === 0) {
    return (
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          AI Optimization Suggestions
        </h2>
        <p className="text-xs text-slate-400">
          No specific recommendations generated for this scan.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            AI Optimization Recommendations
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Follow these action items to boost your resume's ATS ranking and recruiter visibility.
          </p>
        </div>
        <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold rounded-full shrink-0">
          {suggestions.length} Tips
        </span>
      </div>

      <div className="space-y-3 pt-2">
        {suggestions.map((suggestion, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-start gap-3 hover:border-slate-600 transition-colors group"
          >
            <div className="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition-transform">
              <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-200 leading-relaxed">{suggestion}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AtsSuggestionsList;
