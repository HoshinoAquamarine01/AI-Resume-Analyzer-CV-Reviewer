import React from "react";
import { ResumeBuilderData } from "../../../types/builder.types";

interface TemplateProps {
  data: ResumeBuilderData;
  themeClass?: string;
  accentBg: string;
  accentText: string;
  accentBorder: string;
}

export const ModernTemplate: React.FC<TemplateProps> = ({
  data,
  accentBg,
  accentText,
  accentBorder,
}) => {
  const { personal, experiences, educations, skills, projects } = data;

  return (
    <div className="w-full bg-white text-slate-900 min-h-[1050px] p-8 font-sans flex flex-col justify-between shadow-2xl rounded-sm">
     
      <div>
        <div className={`p-6 rounded-xl ${accentBg} text-white space-y-2 mb-6`}>
          <h1 className="text-3xl font-bold tracking-tight">{personal.fullName || "Your Full Name"}</h1>
          <p className="text-lg font-medium opacity-90">{personal.jobTitle || "Professional Title"}</p>
          <div className="flex flex-wrap items-center gap-4 text-xs pt-2 opacity-80 border-t border-white/20">
            {personal.email && <span>📧 {personal.email}</span>}
            {personal.phone && <span>📱 {personal.phone}</span>}
            {personal.location && <span>📍 {personal.location}</span>}
            {personal.linkedin && <span>🔗 {personal.linkedin}</span>}
            {personal.github && <span>💻 {personal.github}</span>}
          </div>
        </div>

       
        <div className="grid grid-cols-12 gap-6 items-start">
        
          <div className="col-span-8 space-y-6">
          
            {personal.summary && (
              <section className="space-y-2">
                <h2 className={`text-sm font-bold uppercase tracking-wider ${accentText} border-b ${accentBorder} pb-1`}>
                  Professional Summary
                </h2>
                <p className="text-xs text-slate-700 leading-relaxed">{personal.summary}</p>
              </section>
            )}

          
            {experiences && experiences.length > 0 && (
              <section className="space-y-4">
                <h2 className={`text-sm font-bold uppercase tracking-wider ${accentText} border-b ${accentBorder} pb-1`}>
                  Work Experience
                </h2>
                <div className="space-y-4">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="space-y-1.5">
                      <div className="flex items-baseline justify-between text-xs font-semibold">
                        <span className="text-slate-900 text-sm font-bold">{exp.role}</span>
                        <span className="text-slate-500 font-mono text-[11px]">
                          {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                        </span>
                      </div>
                      <div className="text-xs font-medium text-slate-600">
                        {exp.company} {exp.location && `• ${exp.location}`}
                      </div>
                      {exp.highlights && exp.highlights.length > 0 && (
                        <ul className="list-disc list-inside text-xs text-slate-700 space-y-1 pl-1">
                          {exp.highlights.map((h, i) => h.trim() && <li key={i}>{h}</li>)}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

           
            {projects && projects.length > 0 && (
              <section className="space-y-3">
                <h2 className={`text-sm font-bold uppercase tracking-wider ${accentText} border-b ${accentBorder} pb-1`}>
                  Featured Projects
                </h2>
                <div className="space-y-3">
                  {projects.map((proj) => (
                    <div key={proj.id} className="space-y-1 text-xs">
                      <div className="flex items-center justify-between font-semibold">
                        <span className="text-slate-900 font-bold">{proj.name}</span>
                        {proj.techStack && <span className="text-[10px] text-slate-500 font-mono">{proj.techStack}</span>}
                      </div>
                      {proj.description && <p className="text-slate-700 leading-normal">{proj.description}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

       
          <div className="col-span-4 space-y-6">
           
            {skills && skills.length > 0 && (
              <section className="space-y-2">
                <h2 className={`text-sm font-bold uppercase tracking-wider ${accentText} border-b ${accentBorder} pb-1`}>
                  Skills & Expertise
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((sk) => (
                    <span
                      key={sk.id}
                      className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-800 border border-slate-200"
                    >
                      {sk.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            
            {educations && educations.length > 0 && (
              <section className="space-y-3">
                <h2 className={`text-sm font-bold uppercase tracking-wider ${accentText} border-b ${accentBorder} pb-1`}>
                  Education
                </h2>
                <div className="space-y-3">
                  {educations.map((edu) => (
                    <div key={edu.id} className="text-xs space-y-0.5">
                      <div className="font-bold text-slate-900">{edu.degree}</div>
                      <div className="text-slate-700">{edu.fieldOfStudy}</div>
                      <div className="text-[11px] text-slate-500">{edu.institution}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {edu.startDate} — {edu.endDate}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

     
      <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
        <span>Generated via AI Resume Analyzer & CV Reviewer</span>
        <span>A4 Format</span>
      </div>
    </div>
  );
};

export default ModernTemplate;
