import React, { useState } from "react";
import { ChevronDown, ThumbsUp, ThumbsDown, TrendingUp, Check } from "lucide-react";
import { FaqItem } from "./faqData";

interface FaqAccordionItemProps {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}

export const FaqAccordionItem: React.FC<FaqAccordionItemProps> = ({
  item,
  isOpen,
  onToggle,
}) => {
  const [feedback, setFeedback] = useState<"helpful" | "unhelpful" | null>(null);

  const handleFeedback = (type: "helpful" | "unhelpful", e: React.MouseEvent) => {
    e.stopPropagation();
    setFeedback(type);
  };

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
        isOpen
          ? "bg-slate-900/90 border-emerald-500/40 shadow-xl shadow-emerald-950/20"
          : "bg-slate-900/40 border-slate-800/80 hover:border-slate-700/80 hover:bg-slate-900/70"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 focus:outline-none group"
        aria-expanded={isOpen}
      >
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700/50">
              {item.categoryName}
            </span>
            {item.popular && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                Popular
              </span>
            )}
          </div>

          <h3
            className={`text-base sm:text-lg font-bold transition-colors ${
              isOpen ? "text-emerald-300" : "text-slate-100 group-hover:text-white"
            }`}
          >
            {item.question}
          </h3>
        </div>

        <div
          className={`mt-1 p-2 rounded-xl border transition-all duration-300 flex items-center justify-center shrink-0 ${
            isOpen
              ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400 rotate-180"
              : "bg-slate-800/80 border-slate-700 text-slate-400 group-hover:text-white group-hover:border-slate-600"
          }`}
        >
          <ChevronDown className="w-4 h-4" />
        </div>
      </button>

      {isOpen && (
        <div className="px-5 sm:px-6 pb-6 pt-1 text-slate-300 border-t border-slate-800/80 space-y-4 animate-fadeIn">
          <p className="text-sm sm:text-base leading-relaxed text-slate-300">
            {item.answer}
          </p>

          {item.tags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap pt-2">
              <span className="text-xs text-slate-400 mr-1">Tags:</span>
              {item.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800/60 text-slate-400 border border-slate-700/40"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center justify-between flex-wrap gap-3 text-xs text-slate-400">
            <span>Was this answer helpful to you?</span>
            <div className="flex items-center gap-2">
              {feedback === null ? (
                <>
                  <button
                    onClick={(e) => handleFeedback("helpful", e)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-500/20 hover:text-emerald-300 border border-slate-700 hover:border-emerald-500/30 transition-all"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Helpful</span>
                  </button>
                  <button
                    onClick={(e) => handleFeedback("unhelpful", e)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 hover:text-rose-300 border border-slate-700 hover:border-rose-500/30 transition-all"
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                    <span>Not helpful</span>
                  </button>
                </>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <Check className="w-3.5 h-3.5" />
                  Thanks for your feedback!
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FaqAccordionItem;
