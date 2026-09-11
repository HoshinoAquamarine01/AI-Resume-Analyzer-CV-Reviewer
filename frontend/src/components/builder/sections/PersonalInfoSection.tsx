import React from "react";
import { PersonalInfo } from "../../../types/builder.types";
import { User, Briefcase, Mail, Phone, MapPin, Globe, Linkedin, Github, FileText } from "lucide-react";

interface PersonalInfoSectionProps {
  personal: PersonalInfo;
  onChange: (field: keyof PersonalInfo, value: string) => void;
}

export const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({ personal, onChange }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-blue-400" />
            Full Name
          </label>
          <input
            type="text"
            value={personal.fullName}
            onChange={(e) => onChange("fullName", e.target.value)}
            placeholder="e.g. Alex Morgan"
            className="w-full bg-slate-900/80 border border-slate-700/70 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

       
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
            Target Job Title
          </label>
          <input
            type="text"
            value={personal.jobTitle}
            onChange={(e) => onChange("jobTitle", e.target.value)}
            placeholder="e.g. Senior Full Stack Engineer"
            className="w-full bg-slate-900/80 border border-slate-700/70 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

       
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-emerald-400" />
            Email Address
          </label>
          <input
            type="email"
            value={personal.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="e.g. alex@example.com"
            className="w-full bg-slate-900/80 border border-slate-700/70 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

       
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-purple-400" />
            Phone Number
          </label>
          <input
            type="text"
            value={personal.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            placeholder="e.g. +1 (555) 000-0000"
            className="w-full bg-slate-900/80 border border-slate-700/70 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            Location
          </label>
          <input
            type="text"
            value={personal.location}
            onChange={(e) => onChange("location", e.target.value)}
            placeholder="e.g. San Francisco, CA"
            className="w-full bg-slate-900/80 border border-slate-700/70 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

   
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-cyan-400" />
            Portfolio Website
          </label>
          <input
            type="text"
            value={personal.website || ""}
            onChange={(e) => onChange("website", e.target.value)}
            placeholder="https://yourportfolio.com"
            className="w-full bg-slate-900/80 border border-slate-700/70 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

      
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Linkedin className="w-3.5 h-3.5 text-blue-400" />
            LinkedIn Profile
          </label>
          <input
            type="text"
            value={personal.linkedin || ""}
            onChange={(e) => onChange("linkedin", e.target.value)}
            placeholder="https://linkedin.com/in/username"
            className="w-full bg-slate-900/80 border border-slate-700/70 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

      
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Github className="w-3.5 h-3.5 text-slate-400" />
            GitHub Profile
          </label>
          <input
            type="text"
            value={personal.github || ""}
            onChange={(e) => onChange("github", e.target.value)}
            placeholder="https://github.com/username"
            className="w-full bg-slate-900/80 border border-slate-700/70 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

     
      <div>
        <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-amber-400" />
          Professional Summary
        </label>
        <textarea
          rows={4}
          value={personal.summary}
          onChange={(e) => onChange("summary", e.target.value)}
          placeholder="Briefly describe your career achievements, key technical strengths, and impact..."
          className="w-full bg-slate-900/80 border border-slate-700/70 rounded-xl p-3 text-xs text-white leading-relaxed focus:outline-none focus:border-blue-500 transition-colors resize-none"
        />
      </div>
    </div>
  );
};

export default PersonalInfoSection;
