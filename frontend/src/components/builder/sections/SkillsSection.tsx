import React, { useState } from "react";
import { SkillItem } from "../../../types/builder.types";
import { Plus, X, Wrench } from "lucide-react";

interface SkillsSectionProps {
  skills: SkillItem[];
  onAdd: (name: string, level?: SkillItem["level"]) => void;
  onRemove: (id: string) => void;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills, onAdd, onRemove }) => {
  const [newSkillInput, setNewSkillInput] = useState<string>("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newSkillInput.trim()) {
      e.preventDefault();
      onAdd(newSkillInput.trim());
      setNewSkillInput("");
    }
  };

  const handleAddClick = () => {
    if (newSkillInput.trim()) {
      onAdd(newSkillInput.trim());
      setNewSkillInput("");
    }
  };

  const POPULAR_SUGGESTIONS = [
    "React.js",
    "Node.js",
    "TypeScript",
    "Python",
    "Docker",
    "AWS",
    "GraphQL",
    "TailwindCSS",
    "PostgreSQL",
    "System Architecture",
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={newSkillInput}
          onChange={(e) => setNewSkillInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a skill and press Enter..."
          className="flex-1 bg-slate-900/80 border border-slate-700/70 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={handleAddClick}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

     
      <div>
        <span className="text-[11px] text-slate-400 font-medium block mb-1.5">Quick Suggestions:</span>
        <div className="flex flex-wrap gap-1.5">
          {POPULAR_SUGGESTIONS.map((s) => {
            const exists = skills.some((sk) => sk.name.toLowerCase() === s.toLowerCase());
            return (
              <button
                key={s}
                disabled={exists}
                onClick={() => onAdd(s)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                  exists
                    ? "bg-slate-800/40 text-slate-500 cursor-not-allowed"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/50"
                }`}
              >
                + {s}
              </button>
            );
          })}
        </div>
      </div>

    
      <div className="pt-2">
        <span className="text-xs font-semibold text-slate-300 block mb-2 flex items-center gap-1.5">
          <Wrench className="w-3.5 h-3.5 text-purple-400" /> Active Skills ({skills.length}):
        </span>
        <div className="flex flex-wrap gap-2">
          {skills.map((sk) => (
            <span
              key={sk.id}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 font-medium group"
            >
              {sk.name}
              <button
                onClick={() => onRemove(sk.id)}
                className="text-slate-400 hover:text-rose-400 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsSection;
