import React from "react";
import { ResumeBuilderData } from "../../../types/builder.types";

interface TemplateProps {
  data: ResumeBuilderData;
  accentBg: string;
  accentText: string;
  accentBorder: string;
}

export const ProfessionalTemplate: React.FC<TemplateProps> = ({
  data,
  accentText,
  accentBorder,
}) => {
  const { personal, experiences, educations, skills, projects } = data;

  return (
    <div className="w-full bg-white text-slate-900 min-h-[1050px] p-10 font-serif flex flex-col justify-between shadow-2xl rounded-sm">
      <div className="space-y-6">
      
        <div className="text-center space-y-2 border-b-2 border-slate-900 pb-5">
          <h1 className="text-3xl font-extrabold tracking-wide uppercase font-sans text-slate-900">
            {personal.fullName || "Your Full Name"}
          </h1>
          <p className={`text-base font-semibold font-sans uppercase tracking-widest ${accentText}`}>
            {personal.jobTitle || "Professional Title"}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-sans text-slate-600 pt-1">
            {personal.email && <span>{personal.email}</span>}
            {personal.phone && <span>• {personal.phone}</span>}
            {personal.location && <span>• {personal.location}</span>}
            {personal.linkedin && <span>• {personal.linkedin}</span>}
          </div>
        </div>

        
        {personal.summary && (
          <section className="space-y-1.5">
            <h2 className="text-xs font-bold uppercase tracking-wider font-sans text-slate-900 border-b border-slate-300 pb-1">
              Executive Summary
            </h2>
            <p className="text-xs text-slate-800 leading-relaxed font-sans">{personal.summary}</p>
          </section>
        )}

        
        {experiences && experiences.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider font-sans text-slate-900 border-b border-slate-300 pb-1">
              Professional Experience
            </h2>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="space-y-1 font-sans">
                  <div className="flex items-baseline justify-between text-xs font-bold text-slate-900">
                    <span>
                      {exp.role} <span className="font-normal text-slate-600">— {exp.company}</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      {exp.startDate} – {exp.current ? "Present" : exp.endDate}
                    </span>
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

    
        {educations && educations.length > 0 && (
          <section className="space-y-2 font-sans">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
              Education & Qualifications
            </h2>
            <div className="space-y-2">
              {educations.map((edu) => (
                <div key={edu.id} className="flex items-baseline justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{edu.degree}</span> in {edu.fieldOfStudy} —{" "}
                    <span className="italic text-slate-700">{edu.institution}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">
                    {edu.startDate} – {edu.endDate}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

       
        {skills && skills.length > 0 && (
          <section className="space-y-1.5 font-sans">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
              Technical Core Competencies
            </h2>
            <p className="text-xs text-slate-800 leading-relaxed font-medium">
              {skills.map((s) => s.name).join(" • ")}
            </p>
          </section>
        )}
      </div>

    
      <div className="pt-4 border-t border-slate-200 text-center text-[10px] font-sans text-slate-400">
        Confidential Resume • Generated via AI Resume Analyzer
      </div>
    </div>
  );
};

export default ProfessionalTemplate;
