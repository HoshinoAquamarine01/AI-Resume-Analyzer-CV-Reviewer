import React, { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useResumeBuilder } from "../hooks/useResumeBuilder";
import BuilderHeader from "../components/builder/BuilderHeader";
import PersonalInfoSection from "../components/builder/sections/PersonalInfoSection";
import ExperienceSection from "../components/builder/sections/ExperienceSection";
import EducationSection from "../components/builder/sections/EducationSection";
import SkillsSection from "../components/builder/sections/SkillsSection";
import ProjectsSection from "../components/builder/sections/ProjectsSection";
import ResumePreviewCanvas from "../components/builder/preview/ResumePreviewCanvas";
import { TemplateId } from "../types/builder.types";
import { User, Briefcase, GraduationCap, Wrench, FolderGit2, ChevronDown, ChevronUp } from "lucide-react";

type ActiveTab = "personal" | "experience" | "education" | "skills" | "projects";

export const ResumeBuilderPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [searchParams] = useSearchParams();
  const initialTemplateId = (searchParams.get("templateId") as TemplateId) || "modern";

  const {
    data,
    loading,
    isSaving,
    isExporting,
    zoomLevel,
    setZoomLevel,
    updateTitle,
    updateTemplate,
    updateColorTheme,
    updatePersonal,
    addExperience,
    updateExperience,
    removeExperience,
    addEducation,
    updateEducation,
    removeEducation,
    addSkill,
    removeSkill,
    addProject,
    updateProject,
    removeProject,
    saveResume,
    exportPdf,
  } = useResumeBuilder(id, initialTemplateId);

  const [activeTab, setActiveTab] = useState<ActiveTab>("personal");

  const TABS: { id: ActiveTab; label: string; icon: any }[] = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "skills", label: "Skills", icon: Wrench },
    { id: "projects", label: "Projects", icon: FolderGit2 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex flex-col items-center justify-center text-blue-400 gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
        <span className="text-sm font-medium text-slate-400">Loading Resume Builder...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-blue-500 selection:text-white overflow-hidden">
     
      <BuilderHeader
        title={data.title}
        onTitleChange={updateTitle}
        templateId={data.templateId}
        onTemplateChange={updateTemplate}
        colorTheme={data.colorTheme}
        onColorThemeChange={updateColorTheme}
        zoomLevel={zoomLevel}
        onZoomChange={setZoomLevel}
        onSave={saveResume}
        isSaving={isSaving}
        onExport={exportPdf}
        isExporting={isExporting}
      />

     
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 h-[calc(100vh-61px)] overflow-hidden">
      
        <div className="lg:col-span-5 bg-[#0e1424]/90 border-r border-slate-800/80 flex flex-col h-full overflow-hidden">
      
          <div className="flex items-center gap-1 p-2 bg-slate-900/80 border-b border-slate-800 overflow-x-auto custom-scrollbar">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

         
          <div className="flex-1 p-5 overflow-y-auto custom-scrollbar space-y-6">
            {activeTab === "personal" && (
              <PersonalInfoSection personal={data.personal} onChange={updatePersonal} />
            )}

            {activeTab === "experience" && (
              <ExperienceSection
                experiences={data.experiences}
                onAdd={addExperience}
                onUpdate={updateExperience}
                onRemove={removeExperience}
              />
            )}

            {activeTab === "education" && (
              <EducationSection
                educations={data.educations}
                onAdd={addEducation}
                onUpdate={updateEducation}
                onRemove={removeEducation}
              />
            )}

            {activeTab === "skills" && (
              <SkillsSection
                skills={data.skills}
                onAdd={addSkill}
                onRemove={removeSkill}
              />
            )}

            {activeTab === "projects" && (
              <ProjectsSection
                projects={data.projects}
                onAdd={addProject}
                onUpdate={updateProject}
                onRemove={removeProject}
              />
            )}
          </div>
        </div>

   
        <div className="lg:col-span-7 bg-[#0b0f19] h-full overflow-hidden flex flex-col items-center">
          <ResumePreviewCanvas data={data} zoomLevel={zoomLevel} />
        </div>
      </main>
    </div>
  );
};

export default ResumeBuilderPage;
