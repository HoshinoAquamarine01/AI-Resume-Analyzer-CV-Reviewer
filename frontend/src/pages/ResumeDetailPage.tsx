import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import MainLayout from "../components/layout/MainLayout";
import ResumeDetailHeader from "../components/resumes/ResumeDetailHeader";
import ResumeScoreOverview from "../components/resumes/ResumeScoreOverview";
import ResumeAnalysisDetails from "../components/resumes/ResumeAnalysisDetails";
import resumeService from "../services/resumeService";
import { Resume } from "../types/resume.types";
import { ResumeAnalysisResult } from "../types/ai.types";

export const ResumeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [resume, setResume] = useState<Resume | null>(null);
  const [analysis, setAnalysis] = useState<ResumeAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const fetchResumeData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await resumeService.getResumeById(id);
      const resumeData = res.data || res.resume || res;
      setResume(resumeData);
      try {
        const analysisRes = await resumeService.getResumeAnalysis(id);
        const analysisData = analysisRes.data || analysisRes.analysis || analysisRes;
        setAnalysis(analysisData);
      } catch {

        setAnalysis(null);
      }
    } catch (err: any) {
      toast.error("Failed to load resume details");
      navigate("/resumes");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchResumeData();
  }, [fetchResumeData]);

  const handleAnalyze = async () => {
    if (!id) return;
    try {
      setIsAnalyzing(true);
      toast.loading("Analyzing CV with AI...", { id: "analyze-toast" });
      const res = await resumeService.analyzeResume(id);
      const newAnalysis = res.data || res.analysis || res;
      setAnalysis(newAnalysis);
      toast.success("AI Analysis Complete!", { id: "analyze-toast" });
    } catch (err: any) {
      toast.error("Failed to perform AI analysis", { id: "analyze-toast" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDownload = async () => {
    if (!id || !resume) return;
    try {
      toast.loading("Downloading resume file...", { id: "dl-toast" });
      const data = await resumeService.downloadResume(id);
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${resume.title || "resume"}.${resume.fileUrl?.endsWith(".docx") ? "docx" : "pdf"}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Download started!", { id: "dl-toast" });
    } catch (err: any) {
      toast.error("Failed to download file", { id: "dl-toast" });
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!window.confirm("Are you sure you want to delete this resume?")) return;
    try {
      await resumeService.deleteResume(id);
      toast.success("Resume deleted successfully");
      navigate("/resumes");
    } catch (err: any) {
      toast.error("Failed to delete resume");
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-blue-400 gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
          <span className="text-sm font-medium text-slate-400">Loading resume details...</span>
        </div>
      </MainLayout>
    );
  }

  if (!resume) return null;

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        
        <ResumeDetailHeader
          title={resume.title}
          fileType={resume.fileUrl?.endsWith(".docx") ? "docx" : "pdf"}
          createdAt={resume.createdAt}
          updatedAt={resume.updatedAt}
          isAnalyzing={isAnalyzing}
          onAnalyze={handleAnalyze}
          onDownload={handleDownload}
          onDelete={handleDelete}
        />

    
        <ResumeScoreOverview
          score={analysis?.score ?? 0}
          strengthsCount={analysis?.strengths?.length ?? 0}
          weaknessesCount={analysis?.weaknesses?.length ?? 0}
          recommendationsCount={analysis?.recommendations?.length ?? 0}
        />

       
        <ResumeAnalysisDetails
          analysis={analysis}
          extractedText={resume.extractedText || resume.rawText}
          isAnalyzing={isAnalyzing}
        />
      </div>
    </MainLayout>
  );
};

export default ResumeDetailPage;
