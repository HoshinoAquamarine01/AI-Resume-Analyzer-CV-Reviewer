import React from "react";
import { ResumeBuilderData } from "../../../types/builder.types";

interface TemplateProps {
  data: ResumeBuilderData;
  accentBg: string;
  accentText: string;
  accentBorder: string;
}

export const CreativeTemplate: React.FC<TemplateProps> = ({
  data,
  accentBg,
  accentText,
}) => {
  const { personal, experiences, educations, skills, projects } = data;

  return (
    <div className="w-full bg-white text-slate-900 min-h-[1050px] font-sans flex flex-col justify-between shadow-2xl rounded-sm overflow-hidden">
      <div>
    
        <div className={`${accentBg} text-white p-8 space-y-3`}>
          <h1 className="text-4xl font-extrabold tracking-tight">{personal.fullName || "Your Full Name"}</h1>
          <p className="text-xl font-medium text-white/90">{personal.jobTitle || "Professional Title"}</p>
          <div className="flex flex-wrap gap-4 text-xs pt-2 text-white/80 font-medium">
            {personal.email && <span> {personal.email}</span>}
            {personal.phone && <span> {personal.phone}</span>}
            {personal.location && <span> {personal.location}</span>}
            {personal.website && <span> {personal.website}</span>}
          </div>
        </div>

     
        <div className="p-8 space-y-6">
         
          {personal.summary && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium">
              {personal.summary}
            </div>
          )}

        
          {experiences && experiences.length > 0 && (
            <section className="space-y-4">
              <h2 className={`text-sm font-bold uppercase tracking-wider ${accentText} flex items-center gap-2`}>
                <span className={`w-2.5 h-2.5 rounded-full ${accentBg}`} />
                Work Experience
              </h2>
              <div className="space-y-4 border-l-2 border-slate-200 pl-4 ml-1">
                {experiences.map((exp) => (
                  <div key={exp.id} className="space-y-1 relative">
                    <div className="flex items-baseline justify-between text-xs font-bold">
                      <span className="text-slate-900 text-sm">{exp.role}</span>
                      <span className="text-slate-500 font-mono text-[11px]">
                        {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-600">{exp.company}</div>
                    {exp.highlights && exp.highlights.length > 0 && (
                      <ul className="text-xs text-slate-700 space-y-1 pt-1 list-disc list-inside">
                        {exp.highlights.map((h, i) => h.trim() && <li key={i}>{h}</li>)}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

       
          <div className="grid grid-cols-2 gap-6">
          
            {skills && skills.length > 0 && (
              <section className="space-y-3">
                <h2 className={`text-sm font-bold uppercase tracking-wider ${accentText} flex items-center gap-2`}>
                  <span className={`w-2.5 h-2.5 rounded-full ${accentBg}`} />
                  Skills
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((sk) => (
                    <span key={sk.id} className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800">
                      {sk.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

           
            {educations && educations.length > 0 && (
              <section className="space-y-3">
                <h2 className={`text-sm font-bold uppercase tracking-wider ${accentText} flex items-center gap-2`}>
                  <span className={`w-2.5 h-2.5 rounded-full ${accentBg}`} />
                  Education
                </h2>
                <div className="space-y-2">
                  {educations.map((edu) => (
                    <div key={edu.id} className="text-xs">
                      <div className="font-bold text-slate-900">{edu.degree}</div>
                      <div className="text-slate-600">{edu.institution}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{edu.startDate} — {edu.endDate}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-[10px] text-slate-400 font-mono">
        Creative Design • Generated via AI Resume Analyzer
      </div>
    </div>
  );
};

export default CreativeTemplate;
