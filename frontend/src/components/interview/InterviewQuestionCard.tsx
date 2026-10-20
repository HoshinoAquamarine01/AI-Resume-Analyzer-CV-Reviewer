import React, { useState } from "react";
import { MessageSquare, ArrowRight, ArrowLeft, Send, Bot } from "lucide-react";

interface InterviewQuestionCardProps {
  questions: string[];
  jobTitle?: string;
  companyName?: string;
  onSubmitAnswers: (answers: string[]) => void;
  submitting: boolean;
}

export const InterviewQuestionCard: React.FC<InterviewQuestionCardProps> = ({
  questions,
  jobTitle,
  companyName,
  onSubmitAnswers,
  submitting,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<string[]>(Array(questions.length).fill(""));

  const handleAnswerChange = (val: string) => {
    const updated = [...answers];
    updated[currentIndex] = val;
    setAnswers(updated);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = () => {
    onSubmitAnswers(answers);
  };

  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs text-blue-400 font-semibold tracking-wider uppercase block mb-1">
              Interview Session for {jobTitle || "Role"} at {companyName || "Company"}
            </span>
            <h3 className="text-lg font-bold text-white">
              Question {currentIndex + 1} of {questions.length}
            </h3>
          </div>
          <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-300 font-mono text-xs font-semibold rounded-full">
            {progressPercent}% Completed
          </span>
        </div>

        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex gap-4 p-4 rounded-xl bg-blue-950/30 border border-blue-800/40 text-blue-100">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <span className="text-xs font-semibold text-blue-400 block mb-1">AI Interviewer Asks:</span>
            <p className="text-base sm:text-lg font-medium text-white leading-relaxed">
              "{questions[currentIndex]}"
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-blue-400" />
            Your Answer:
          </label>
          <textarea
            rows={5}
            value={answers[currentIndex]}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Structure your answer clearly (Situation, Task, Action, Result)..."
            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors text-sm resize-none"
          />
          <p className="text-xs text-slate-500 mt-2 text-right">
            Tip: Apply the STAR technique (Situation, Task, Action, Result) for higher evaluation scores.
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-sm font-medium flex items-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold flex items-center gap-2 transition-all shadow-md shadow-blue-600/20"
            >
              Next Question <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-semibold flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Evaluating Answers...
                </>
              ) : (
                <>
                  Submit Answers & Get Evaluation <Send className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default InterviewQuestionCard;
