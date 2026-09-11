import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ResumeBuilderData,
  TemplateId,
  ColorTheme,
  PersonalInfo,
  ExperienceItem,
  EducationItem,
  SkillItem,
  ProjectItem,
} from "../types/builder.types";
import resumeService from "../services/resumeService";

const DEFAULT_BUILDER_DATA: ResumeBuilderData = {
  title: "My Professional Resume",
  templateId: "modern",
  colorTheme: "indigo",
  personal: {
    fullName: "Alex Morgan",
    jobTitle: "Senior Full Stack Engineer",
    email: "alex.morgan@example.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    website: "https://alexmorgan.dev",
    linkedin: "https://linkedin.in/alexmorgan",
    github: "https://github.com/alexmorgan",
    summary:
      "Results-driven Senior Full Stack Engineer with 6+ years of experience designing and deploying scalable web applications, microservices, and AI-driven interfaces. Passionate about performant code and modern UX.",
  },
  experiences: [
    {
      id: "exp-1",
      company: "TechNova Systems",
      role: "Senior Software Engineer",
      location: "San Francisco, CA",
      startDate: "2022-03",
      endDate: "",
      current: true,
      description: "Led core frontend and microservices architecture transformation.",
      highlights: [
        "Spearheaded redesign of web dashboard, increasing user conversion by 34%.",
        "Architected scalable NestJS API processing over 1M requests daily with 99.99% uptime.",
        "Mentored junior engineers and established automated CI/CD code review workflows.",
      ],
    },
    {
      id: "exp-2",
      company: "CloudScale Labs",
      role: "Frontend Engineer",
      location: "Austin, TX",
      startDate: "2019-06",
      endDate: "2022-02",
      current: false,
      description: "Developed real-time collaborative web applications.",
      highlights: [
        "Built dynamic data visualizations using React, TypeScript, and TailwindCSS.",
        "Optimized web application bundle sizes by 45% through aggressive lazy loading.",
      ],
    },
  ],
  educations: [
    {
      id: "edu-1",
      institution: "University of California, Berkeley",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      startDate: "2015-08",
      endDate: "2019-05",
      gpa: "3.8 / 4.0",
    },
  ],
  skills: [
    { id: "sk-1", name: "TypeScript", level: "Expert" },
    { id: "sk-2", name: "React.js / Next.js", level: "Expert" },
    { id: "sk-3", name: "Node.js / NestJS", level: "Advanced" },
    { id: "sk-4", name: "TailwindCSS & UI Systems", level: "Expert" },
    { id: "sk-5", name: "MongoDB & PostgreSQL", level: "Advanced" },
    { id: "sk-6", name: "Docker & AWS", level: "Intermediate" },
  ],
  projects: [
    {
      id: "proj-1",
      name: "AI Resume & Portfolio Analyzer",
      techStack: "React, NestJS, OpenAI API, TailwindCSS",
      description: "Automated ATS resume parser and real-time score optimization tool.",
      link: "https://github.com/alexmorgan/resume-analyzer",
    },
  ],
  certifications: [],
};

export const useResumeBuilder = (resumeId?: string, initialTemplateId?: TemplateId) => {
  const navigate = useNavigate();
  const [data, setData] = useState<ResumeBuilderData>(() => ({
    ...DEFAULT_BUILDER_DATA,
    templateId: initialTemplateId || "modern",
  }));

  const [loading, setLoading] = useState<boolean>(Boolean(resumeId));
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);


  useEffect(() => {
    if (!resumeId) return;

    let isMounted = true;
    const fetchExistingResume = async () => {
      try {
        setLoading(true);
        const res = await resumeService.getResumeById(resumeId);
        const fetched = res?.data || res?.resume || res;

        if (isMounted && fetched) {
          setData((prev) => ({
            ...prev,
            title: fetched.title || prev.title,
            personal: {
              fullName: fetched.personal?.fullName || fetched.title || prev.personal.fullName,
              jobTitle: fetched.personal?.title || prev.personal.jobTitle,
              email: fetched.personal?.email || prev.personal.email,
              phone: fetched.personal?.phone || prev.personal.phone,
              location: fetched.personal?.location?.city
                ? `${fetched.personal.location.city}, ${fetched.personal.location.country || ""}`
                : prev.personal.location,
              website: fetched.personal?.website || prev.personal.website,
              linkedin: fetched.personal?.linkedin || prev.personal.linkedin,
              github: fetched.personal?.github || prev.personal.github,
              summary: fetched.extractedText || fetched.rawText || prev.personal.summary,
            },
          }));
        }
      } catch (err) {
        console.error("Error fetching existing resume:", err);
        toast.error("Failed to load existing resume data.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchExistingResume();
    return () => {
      isMounted = false;
    };
  }, [resumeId]);


  const updateTitle = (title: string) => setData((prev) => ({ ...prev, title }));
  const updateTemplate = (templateId: TemplateId) => setData((prev) => ({ ...prev, templateId }));
  const updateColorTheme = (colorTheme: ColorTheme) => setData((prev) => ({ ...prev, colorTheme }));

  const updatePersonal = (field: keyof PersonalInfo, value: string) => {
    setData((prev) => ({
      ...prev,
      personal: { ...prev.personal, [field]: value },
    }));
  };

  
  const addExperience = () => {
    const newItem: ExperienceItem = {
      id: `exp-${Date.now()}`,
      company: "",
      role: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      highlights: [""],
    };
    setData((prev) => ({ ...prev, experiences: [...prev.experiences, newItem] }));
  };

  const updateExperience = (id: string, field: keyof ExperienceItem, value: any) => {
    setData((prev) => ({
      ...prev,
      experiences: prev.experiences.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  const removeExperience = (id: string) => {
    setData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((item) => item.id !== id),
    }));
  };


  const addEducation = () => {
    const newItem: EducationItem = {
      id: `edu-${Date.now()}`,
      institution: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
    };
    setData((prev) => ({ ...prev, educations: [...prev.educations, newItem] }));
  };

  const updateEducation = (id: string, field: keyof EducationItem, value: any) => {
    setData((prev) => ({
      ...prev,
      educations: prev.educations.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  const removeEducation = (id: string) => {
    setData((prev) => ({
      ...prev,
      educations: prev.educations.filter((item) => item.id !== id),
    }));
  };


  const addSkill = (name: string, level: SkillItem["level"] = "Intermediate") => {
    if (!name.trim()) return;
    const newItem: SkillItem = {
      id: `sk-${Date.now()}`,
      name: name.trim(),
      level,
    };
    setData((prev) => ({ ...prev, skills: [...prev.skills, newItem] }));
  };

  const removeSkill = (id: string) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.filter((item) => item.id !== id),
    }));
  };


  const addProject = () => {
    const newItem: ProjectItem = {
      id: `proj-${Date.now()}`,
      name: "",
      techStack: "",
      description: "",
    };
    setData((prev) => ({ ...prev, projects: [...prev.projects, newItem] }));
  };

  const updateProject = (id: string, field: keyof ProjectItem, value: any) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  const removeProject = (id: string) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((item) => item.id !== id),
    }));
  };


  const saveResume = async () => {
    try {
      setIsSaving(true);
      toast.loading("Saving resume to your account...", { id: "save-builder" });

      const textSummary = `
Title: ${data.personal.fullName} - ${data.personal.jobTitle}
Summary: ${data.personal.summary}
Skills: ${data.skills.map((s) => s.name).join(", ")}
Experience: ${data.experiences.map((e) => `${e.role} at ${e.company}: ${e.highlights.join(" ")}`).join("\n")}
      `.trim();

      const payload = {
        title: data.title || "My Resume",
        fileType: "pdf" as const,
        extractedText: textSummary,
      };

      if (resumeId) {
        await resumeService.updateResume(resumeId, payload);
        toast.success("Resume updated successfully!", { id: "save-builder" });
      } else {
        const created = await resumeService.createResume({
          title: data.title || "My Resume",
          fileType: "pdf",
        });
        toast.success("Resume created successfully!", { id: "save-builder" });
        const newId = created?.data?._id || created?._id || created?.id;
        if (newId) {
          navigate(`/resumes/${newId}`, { replace: true });
        }
      }
    } catch (err: any) {
      console.error("Save error:", err);
      toast.error(err?.response?.data?.message || "Failed to save resume.", { id: "save-builder" });
    } finally {
      setIsSaving(false);
    }
  };


  const exportPdf = async () => {
    try {
      setIsExporting(true);
      toast.loading("Preparing PDF export...", { id: "export-pdf" });
      window.print();
      toast.success("Print preview launched!", { id: "export-pdf" });
    } catch (err) {
      toast.error("Failed to trigger print preview.", { id: "export-pdf" });
    } finally {
      setIsExporting(false);
    }
  };

  return {
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
  };
};

export default useResumeBuilder;
