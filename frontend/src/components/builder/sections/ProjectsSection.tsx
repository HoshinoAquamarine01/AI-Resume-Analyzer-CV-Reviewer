import React from "react";
import { ProjectItem } from "../../../types/builder.types";
import { Plus, Trash2, FolderGit2 } from "lucide-react";

interface ProjectsSectionProps {
  projects: ProjectItem[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof ProjectItem, value: any) => void;
  onRemove: (id: string) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  onAdd,
  onUpdate,
  onRemove,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">Add key software or engineering projects.</p>
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center p-8 bg-slate-900/50 rounded-2xl border border-slate-800 text-slate-400 text-xs">
          No projects added yet. Click "Add Project" to show off your work.
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((proj, idx) => (
            <div
              key={proj.id}
              className="p-4 bg-slate-900/70 border border-slate-800 rounded-2xl space-y-3 relative"
            >
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <FolderGit2 className="w-4 h-4" />
                  Project #{idx + 1}: {proj.name || "Untitled Project"}
                </span>
                <button
                  onClick={() => onRemove(proj.id)}
                  className="text-slate-400 hover:text-rose-400 transition-colors p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Project Name</label>
                  <input
                    type="text"
                    value={proj.name}
                    onChange={(e) => onUpdate(proj.id, "name", e.target.value)}
                    placeholder="e.g. AI Resume Analyzer"
                    className="w-full bg-slate-950 border border-slate-700/60 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Tech Stack</label>
                  <input
                    type="text"
                    value={proj.techStack}
                    onChange={(e) => onUpdate(proj.id, "techStack", e.target.value)}
                    placeholder="e.g. React, NestJS, Tailwind"
                    className="w-full bg-slate-950 border border-slate-700/60 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Project Link / GitHub URL</label>
                <input
                  type="text"
                  value={proj.link || ""}
                  onChange={(e) => onUpdate(proj.id, "link", e.target.value)}
                  placeholder="https://github.com/yourname/project"
                  className="w-full bg-slate-950 border border-slate-700/60 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={proj.description}
                  onChange={(e) => onUpdate(proj.id, "description", e.target.value)}
                  placeholder="Describe key features and your contributions..."
                  className="w-full bg-slate-950 border border-slate-700/60 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsSection;
