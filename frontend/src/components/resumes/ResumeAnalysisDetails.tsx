import React, { useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  FileText,
  FileCheck,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { ResumeAnalysisResult } from "../../types/ai.types";

interface ResumeAnalysisDetailsProps {
  analysis?: ResumeAnalysisResult | null;
  extractedText?: string;
  isAnalyzing?: boolean;
}

export const ResumeAnalysisDetails: React.FC<ResumeAnalysisDetailsProps> = ({
  analysis,
  extractedText,
  isAnalyzing,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "feedback" | "text">("overview");

  if (isAnalyzing) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
        <div className="inline-flex p-4 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 animate-spin">
          <FileCheck className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-white">AI Scanner is Analyzing Your CV</h3>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          Extracting text, analyzing key skills, structure, and readability metrics...
        </p>
      </div>
    );
  }

  const strengths = analysis?.strengths || [];
  const weaknesses = analysis?.weaknesses || [];
  const recommendations = analysis?.recommendations || [];
  const detailedFeedback = analysis?.detailedFeedback;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
   
      <div className="flex border-b border-slate-800 bg-slate-950/40 p-2 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
            activeTab === "overview"
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
              : "text-slate-400 hover:text-white hover:bg-slate-800/60"
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>AI Overview & Recommendations</span>
        </button>

        <button
          onClick={() => setActiveTab("feedback")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
            activeTab === "feedback"
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
              : "text-slate-400 hover:text-white hover:bg-slate-800/60"
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Formatting & Quality Feedback</span>
        </button>

        <button
          onClick={() => setActiveTab("text")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
            activeTab === "text"
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
              : "text-slate-400 hover:text-white hover:bg-slate-800/60"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Extracted Resume Text</span>
        </button>
      </div>

    
      {activeTab === "overview" && (
        <div className="p-6 space-y-6">
         
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2 uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>Key Strengths ({strengths.length})</span>
            </h3>
            {strengths.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {strengths.map((item, index) => (
                  <div
                    key={index}
                    className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-200 leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No specific strengths recorded.</p>
            )}
          </div>

          
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2 uppercase tracking-wider">
              <AlertCircle className="w-4 h-4" />
              <span>Areas for Improvement ({weaknesses.length})</span>
            </h3>
            {weaknesses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {weaknesses.map((item, index) => (
                  <div
                    key={index}
                    className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-start gap-3"
                  >
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-200 leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No major issues detected.</p>
            )}
          </div>

       
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-blue-400 flex items-center gap-2 uppercase tracking-wider">
              <Lightbulb className="w-4 h-4" />
              <span>Actionable AI Recommendations ({recommendations.length})</span>
            </h3>
            {recommendations.length > 0 ? (
              <div className="space-y-2.5">
                {recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 flex items-start gap-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 font-extrabold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">{rec}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No recommendations available.</p>
            )}
          </div>
        </div>
      )}

     
      {activeTab === "feedback" && (
        <div className="p-6 space-y-6">
          {detailedFeedback?.formatting && detailedFeedback.formatting.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Formatting Notes</h4>
              <ul className="space-y-2">
                {detailedFeedback.formatting.map((note, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-center gap-2 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                    <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {detailedFeedback?.impact && detailedFeedback.impact.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Action Verbs & Impact</h4>
              <ul className="space-y-2">
                {detailedFeedback.impact.map((note, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-center gap-2 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                    <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(!detailedFeedback || Object.keys(detailedFeedback).length === 0) && (
            <div className="text-center py-8 text-slate-400 text-xs">
              No additional formatting logs available for this resume version.
            </div>
          )}
        </div>
      )}

      {activeTab === "text" && (
        <div className="p-6">
          {extractedText ? (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 max-h-96 overflow-y-auto">
              <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
                {extractedText}
              </pre>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 text-xs">
              No extracted text stored for this resume.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeAnalysisDetails;
