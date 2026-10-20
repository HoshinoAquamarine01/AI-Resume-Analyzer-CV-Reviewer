import React, { useState } from "react";
import { CheckCircle2, XCircle, Search, Layers } from "lucide-react";

interface AtsKeywordsBreakdownProps {
  matchingKeywords: string[];
  missingKeywords: string[];
}

export const AtsKeywordsBreakdown: React.FC<AtsKeywordsBreakdownProps> = ({
  matchingKeywords,
  missingKeywords,
}) => {
  const [filterText, setFilterText] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "missing" | "matched">("all");

  const filteredMatched = matchingKeywords.filter((kw) =>
    kw.toLowerCase().includes(filterText.toLowerCase())
  );

  const filteredMissing = missingKeywords.filter((kw) =>
    kw.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            Keyword Analysis Breakdown
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Identify which critical skills recruiter ATS systems are looking for in your resume.
          </p>
        </div>

      
        <div className="relative min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder="Search keywords..."
            className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
        </div>
      </div>

     
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            activeTab === "all"
              ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
          }`}
        >
          All ({matchingKeywords.length + missingKeywords.length})
        </button>
        <button
          onClick={() => setActiveTab("missing")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === "missing"
              ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
          }`}
        >
          <XCircle className="w-3.5 h-3.5 text-rose-400" />
          Missing ({missingKeywords.length})
        </button>
        <button
          onClick={() => setActiveTab("matched")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            activeTab === "matched"
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          Matched ({matchingKeywords.length})
        </button>
      </div>

     
      <div className="space-y-6">
      
        {(activeTab === "all" || activeTab === "missing") && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                <XCircle className="w-4 h-4" />
                Missing Keywords ({filteredMissing.length})
              </span>
              <span className="text-[11px] text-slate-400">
                — Add these to your resume to increase ATS match
              </span>
            </div>

            {filteredMissing.length === 0 ? (
              <p className="text-xs text-slate-400 italic bg-slate-800/20 p-3 rounded-xl border border-slate-800">
                {filterText ? "No missing keywords match your search." : "Awesome! No missing critical keywords detected."}
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {filteredMissing.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs font-medium hover:bg-rose-500/20 transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5 text-rose-400" />
                    {keyword}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {(activeTab === "all" || activeTab === "matched") && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Matched Keywords ({filteredMatched.length})
              </span>
              <span className="text-[11px] text-slate-400">
                — Successfully identified in your resume
              </span>
            </div>

            {filteredMatched.length === 0 ? (
              <p className="text-xs text-slate-400 italic bg-slate-800/20 p-3 rounded-xl border border-slate-800">
                {filterText ? "No matched keywords match your search." : "No matched keywords found yet."}
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {filteredMatched.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs font-medium hover:bg-emerald-500/20 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    {keyword}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AtsKeywordsBreakdown;
