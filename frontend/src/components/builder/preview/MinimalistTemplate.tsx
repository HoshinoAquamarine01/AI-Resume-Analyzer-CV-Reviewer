import React from "react";
import { ResumeBuilderData } from "../../../types/builder.types";

interface TemplateProps {
  data: ResumeBuilderData;
  accentBg: string;
  accentText: string;
  accentBorder: string;
}

export const MinimalistTemplate: React.FC<TemplateProps> = ({
  data,
  accentText,
}) => {
  const { personal, experiences, educations, skills } = data;

  return (
    <div className="w-full bg-white text-slate-900 min-h-[1050px] p-12 font-sans flex flex-col justify-between shadow-2xl rounded-sm">
      <div className="space-y-8">
       
        <div className="space-y-1">
          <h1 className="text-4xl font-light text-slate-900 tracking-tight">
            {personal.fullName || "Your Full Name"}
          </h1>
          <p className={`text-base font-semibold ${accentText} tracking-wide`}>
            {personal.jobTitle || "Professional Title"}
          </p>
          <div className="flex flex-wrap gap-4 text-xs text-slate-500 pt-2 font-mono">
            {personal.email && <span>{personal.email}</span>}
            {personal.phone && <span>/ {personal.phone}</span>}
            {personal.location && <span>/ {personal.location}</span>}
          </div>
        </div>

    
        {personal.summary && (
          <p className="text-xs text-slate-600 leading-relaxed max-w-2xl font-normal">
            {personal.summary}
          </p>
        )}

       
        {experiences && experiences.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-400">
              Experience
            </h2>
            <div className="space-y-5">
              {experiences.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex items-baseline justify-between text-xs font-medium">
                    <span className="text-slate-900 font-bold">{exp.role}</span>
                    <span className="text-slate-400 text-[11px] font-mono">
                      {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-medium">{exp.company}</div>
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="text-xs text-slate-600 space-y-1 pt-1 list-disc list-inside">
                      {exp.highlights.map((h, i) => h.trim() && <li key={i}>{h}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

       
        {educations && educations.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-400">
              Education
            </h2>
            <div className="space-y-3">
              {educations.map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{edu.degree}</div>
                    <div className="text-slate-500">{edu.institution}</div>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {edu.startDate} — {edu.endDate}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

    
        {skills && skills.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-slate-400">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((sk) => (
                <span key={sk.id} className="text-xs text-slate-700 bg-slate-100 px-2 py-1 rounded">
                  {sk.name}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="text-[10px] font-mono text-slate-300">
        Minimalist Layout • AI Resume Analyzer
      </div>
    </div>
  );
};

export default MinimalistTemplate;
