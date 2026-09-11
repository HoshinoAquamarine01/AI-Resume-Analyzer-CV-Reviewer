import React from "react";
import { EducationItem } from "../../../types/builder.types";
import { Plus, Trash2, GraduationCap } from "lucide-react";

interface EducationSectionProps {
  educations: EducationItem[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof EducationItem, value: any) => void;
  onRemove: (id: string) => void;
}

export const EducationSection: React.FC<EducationSectionProps> = ({
  educations,
  onAdd,
  onUpdate,
  onRemove,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">Manage your educational history and qualifications.</p>
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Education
        </button>
      </div>

      {educations.length === 0 ? (
        <div className="text-center p-8 bg-slate-900/50 rounded-2xl border border-slate-800 text-slate-400 text-xs">
          No education history added yet. Click "Add Education" to add your degree.
        </div>
      ) : (
        <div className="space-y-4">
          {educations.map((edu, idx) => (
            <div
              key={edu.id}
              className="p-4 bg-slate-900/70 border border-slate-800 rounded-2xl space-y-3 relative"
            >
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4" />
                  Education #{idx + 1}: {edu.degree || "Degree"}
                </span>
                <button
                  onClick={() => onRemove(edu.id)}
                  className="text-slate-400 hover:text-rose-400 transition-colors p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Institution / University</label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => onUpdate(edu.id, "institution", e.target.value)}
                    placeholder="e.g. UC Berkeley"
                    className="w-full bg-slate-950 border border-slate-700/60 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Degree</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => onUpdate(edu.id, "degree", e.target.value)}
                    placeholder="e.g. Bachelor of Science"
                    className="w-full bg-slate-950 border border-slate-700/60 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Field of Study</label>
                  <input
                    type="text"
                    value={edu.fieldOfStudy}
                    onChange={(e) => onUpdate(edu.id, "fieldOfStudy", e.target.value)}
                    placeholder="e.g. Computer Science"
                    className="w-full bg-slate-950 border border-slate-700/60 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">GPA / Grade (Optional)</label>
                  <input
                    type="text"
                    value={edu.gpa || ""}
                    onChange={(e) => onUpdate(edu.id, "gpa", e.target.value)}
                    placeholder="e.g. 3.8 / 4.0"
                    className="w-full bg-slate-950 border border-slate-700/60 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Start Date</label>
                  <input
                    type="text"
                    value={edu.startDate}
                    onChange={(e) => onUpdate(edu.id, "startDate", e.target.value)}
                    placeholder="e.g. 2018"
                    className="w-full bg-slate-950 border border-slate-700/60 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Graduation Date</label>
                  <input
                    type="text"
                    value={edu.endDate}
                    onChange={(e) => onUpdate(edu.id, "endDate", e.target.value)}
                    placeholder="e.g. 2022"
                    className="w-full bg-slate-950 border border-slate-700/60 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EducationSection;
