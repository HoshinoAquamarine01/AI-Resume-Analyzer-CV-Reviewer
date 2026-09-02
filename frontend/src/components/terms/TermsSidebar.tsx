import React, { useState } from "react";
import { List, ChevronRight } from "lucide-react";

export interface SectionItem {
  id: string;
  title: string;
  number: string;
}

interface TermsSidebarProps {
  sections: SectionItem[];
}

export const TermsSidebar: React.FC<TermsSidebarProps> = ({ sections }) => {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id || "");

  const scrollToSection = (id: string) => {
    setActiveId(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100; 
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <aside className="w-full lg:w-72 shrink-0">
      <div className="lg:sticky lg:top-28 p-5 rounded-2xl bg-[#0d1322] border border-slate-800/80 shadow-xl">
        <div className="flex items-center gap-2.5 pb-4 mb-4 border-b border-slate-800/80">
          <List className="w-4 h-4 text-blue-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Table of Contents
          </h3>
        </div>

        <nav className="space-y-1 max-h-[60vh] overflow-y-auto custom-scrollbar pr-1">
          {sections.map((section) => {
            const isActive = activeId === section.id;
            return (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-all duration-200 group ${
                  isActive
                    ? "bg-blue-600/15 text-blue-400 font-semibold border border-blue-500/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 font-medium"
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      isActive
                        ? "bg-blue-500/20 text-blue-300"
                        : "bg-slate-800 text-slate-400 group-hover:text-slate-300"
                    }`}
                  >
                    {section.number}
                  </span>
                  <span className="truncate">{section.title}</span>
                </div>
                <ChevronRight
                  className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                    isActive
                      ? "text-blue-400 translate-x-0.5"
                      : "text-slate-400 opacity-0 group-hover:opacity-100"
                  }`}
                />
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default TermsSidebar;
