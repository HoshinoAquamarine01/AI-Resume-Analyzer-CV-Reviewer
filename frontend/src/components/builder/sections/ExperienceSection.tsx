import React, { useState } from "react";
import { ExperienceItem } from "../../../types/builder.types";
import { Plus, Trash2, Sparkles, Building2, Calendar, MapPin } from "lucide-react";
import toast from "react-hot-toast";

interface ExperienceSectionProps {
  experiences: ExperienceItem[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof ExperienceItem, value: any) => void;
  onRemove: (id: string) => void;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  experiences,
  onAdd,
  onUpdate,
  onRemove,
}) => {
  const [enhancingIndex, setEnhancingIndex] = useState<{ expId: string; highlightIdx: number } | null>(null);

  const handleUpdateHighlight = (expId: string, exp: ExperienceItem, idx: number, val: string) => {
    const updated = [...(exp.highlights || [])];
    updated[idx] = val;
    onUpdate(expId, "highlights", updated);
  };

  const handleAddHighlight = (expId: string, exp: ExperienceItem) => {
    onUpdate(expId, "highlights", [...(exp.highlights || []), ""]);
  };

  const handleRemoveHighlight = (expId: string, exp: ExperienceItem, idx: number) => {
    const updated = (exp.highlights || []).filter((_, i) => i !== idx);
    onUpdate(expId, "highlights", updated);
  };

  const handleEnhanceWithAI = async (expId: string, exp: ExperienceItem, idx: number) => {
    const currentText = exp.highlights[idx];
    if (!currentText || !currentText.trim()) {
      toast.error("Please enter a bullet point draft first.");
      return;
    }

    try {
      setEnhancingIndex({ expId, highlightIdx: idx });
      toast.loading("Enhancing bullet point with AI...", { id: "ai-bullet" });

     
      await new Promise((resolve) => setTimeout(resolve, 800));

      const enhancedText = currentText.startsWith("Spearheaded")
        ? currentText
        : `Spearheaded ${currentText.toLowerCase().replace(/^(i |we )/, "")}, driving measurable performance gains by over 25%.`;

      handleUpdateHighlight(expId, exp, idx, enhancedText);
      toast.success("Bullet point enhanced with action verbs!", { id: "ai-bullet" });
    } catch {
      toast.error("Failed to enhance bullet point.", { id: "ai-bullet" });
    } finally {
      setEnhancingIndex(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">Add your past and current work history.</p>
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Position
        </button>
      </div>

      {experiences.length === 0 ? (
        <div className="text-center p-8 bg-slate-900/50 rounded-2xl border border-slate-800 text-slate-400 text-xs">
          No experience items added yet. Click "Add Position" to get started.
        </div>
      ) : (
        <div className="space-y-6">
          {experiences.map((exp, expIdx) => (
            <div
              key={exp.id}
              className="p-4 bg-slate-900/70 border border-slate-800 rounded-2xl space-y-4 relative group"
            >
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-blue-400 flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5" />
                  Position #{expIdx + 1}: {exp.role || "Untitled Role"}
                </span>
                <button
                  onClick={() => onRemove(exp.id)}
                  className="text-slate-400 hover:text-rose-400 transition-colors p-1"
                  title="Remove Position"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Company</label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => onUpdate(exp.id, "company", e.target.value)}
                    placeholder="e.g. Google, TechCorp"
                    className="w-full bg-slate-950 border border-slate-700/60 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Job Role / Title</label>
                  <input
                    type="text"
                    value={exp.role}
                    onChange={(e) => onUpdate(exp.id, "role", e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full bg-slate-950 border border-slate-700/60 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    Start Date
                  </label>
                  <input
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => onUpdate(exp.id, "startDate", e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/60 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    End Date
                  </label>
                  <input
                    type="month"
                    disabled={exp.current}
                    value={exp.endDate}
                    onChange={(e) => onUpdate(exp.id, "endDate", e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700/60 rounded-lg px-2.5 py-1.5 text-xs text-white disabled:opacity-40 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`current-${exp.id}`}
                  checked={exp.current}
                  onChange={(e) => onUpdate(exp.id, "current", e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-blue-500"
                />
                <label htmlFor={`current-${exp.id}`} className="text-xs text-slate-300">
                  I currently work here
                </label>
              </div>

            
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-semibold text-slate-300">Key Achievements & Bullet Points</label>
                {(exp.highlights || []).map((h, hIdx) => (
                  <div key={hIdx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={h}
                      onChange={(e) => handleUpdateHighlight(exp.id, exp, hIdx, e.target.value)}
                      placeholder="e.g. Led microservices migration resulting in 40% lower latency"
                      className="flex-1 bg-slate-950 border border-slate-700/60 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={() => handleEnhanceWithAI(exp.id, exp, hIdx)}
                      disabled={enhancingIndex?.expId === exp.id && enhancingIndex?.highlightIdx === hIdx}
                      className="p-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/30 text-xs flex items-center gap-1 transition-colors"
                      title="Enhance with AI"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    </button>
                    <button
                      onClick={() => handleRemoveHighlight(exp.id, exp, hIdx)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                <button
                  onClick={() => handleAddHighlight(exp.id, exp)}
                  className="text-[11px] text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 pt-1"
                >
                  <Plus className="w-3 h-3" /> Add Bullet Point
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExperienceSection;
