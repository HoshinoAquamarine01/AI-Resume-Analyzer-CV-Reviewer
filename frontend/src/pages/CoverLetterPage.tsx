import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

import MainLayout from "../components/layout/MainLayout";
import CoverLetterHeader from "../components/cover-letter/CoverLetterHeader";
import CoverLetterForm, { ResumeOption } from "../components/cover-letter/CoverLetterForm";
import CoverLetterPreview, { CoverLetterData } from "../components/cover-letter/CoverLetterPreview";
import CoverLetterHistoryModal from "../components/cover-letter/CoverLetterHistoryModal";

import resumeService from "../services/resumeService";
import coverLetterService, { CoverLetterItem } from "../services/coverLetterService";

export const CoverLetterPage: React.FC = () => {
  const [resumes, setResumes] = useState<ResumeOption[]>([]);
  const [isLoadingResumes, setIsLoadingResumes] = useState<boolean>(true);
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");

  const [jobTitle, setJobTitle] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");
  const [tone, setTone] = useState<string>("professional");

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [currentCoverLetter, setCurrentCoverLetter] = useState<CoverLetterData | null>(null);

  const [historyItems, setHistoryItems] = useState<CoverLetterItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  useEffect(() => {
    fetchUserResumes();
    fetchCoverLetterHistory();
  }, []);

  const fetchUserResumes = async () => {
    setIsLoadingResumes(true);
    try {
      const res = await resumeService.getResumes(1, 50);
      const list = res.data?.resumes || res.resumes || res.data || [];
      setResumes(list);
      if (list.length > 0) {
        setSelectedResumeId(list[0]._id);
      }
    } catch (err: any) {
      toast.error("Failed to load resumes.");
    } finally {
      setIsLoadingResumes(false);
    }
  };

  const fetchCoverLetterHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const res = await coverLetterService.getCoverLetters(1, 50);
      const list = res.data?.coverLetters || res.coverLetters || res.data || [];
      setHistoryItems(list);
    } catch (err: any) {
      console.error("Fetch cover letter history error:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedResumeId) {
      toast.error("Please select a base resume.");
      return;
    }
    if (!jobTitle.trim() || !companyName.trim() || !jobDescription.trim()) {
      toast.error("Please fill in Job Title, Company Name, and Job Description.");
      return;
    }

    setIsGenerating(true);
    setCurrentCoverLetter(null);

    try {
      const res = await coverLetterService.generateCoverLetter({
        resumeId: selectedResumeId,
        jobTitle,
        companyName,
        jobDescription,
      });

      const generatedData = res.data || res;
      setCurrentCoverLetter(generatedData);
      toast.success("Cover letter generated successfully!");

      fetchCoverLetterHistory();
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to generate cover letter. Please try again.";
      toast.error(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateContent = async (id: string, newContent: string) => {
    const res = await coverLetterService.updateCoverLetter(id, {
      content: newContent,
      jobTitle,
      companyName,
    });
    const updated = res.data || res;
    setCurrentCoverLetter(updated);
    fetchCoverLetterHistory();
  };

  const handleExport = async (format: "pdf" | "docx") => {
    if (!currentCoverLetter?._id) return;
    const blobData = await coverLetterService.exportCoverLetter(currentCoverLetter._id, format);

    const blob = new Blob([blobData], {
      type:
        format === "pdf"
          ? "application/pdf"
          : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `CoverLetter_${companyName || "Application"}_${jobTitle || "Role"}.${format}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleSelectHistoryItem = (item: CoverLetterItem) => {
    setCurrentCoverLetter({
      _id: item._id,
      jobTitle: item.jobTitle,
      companyName: item.companyName,
      content: item.content,
      createdAt: item.createdAt,
    });
    setJobTitle(item.jobTitle || "");
    setCompanyName(item.companyName || "");
    if (item.resumeId) setSelectedResumeId(item.resumeId);
  };

  const handleDeleteHistoryItem = async (id: string) => {
    await coverLetterService.deleteCoverLetter(id);
    toast.success("Cover letter deleted.");
    if (currentCoverLetter?._id === id) {
      setCurrentCoverLetter(null);
    }
    fetchCoverLetterHistory();
  };

  return (
    <MainLayout>
      <div className="space-y-6 pb-12">
        <CoverLetterHeader
          historyCount={historyItems.length}
          onOpenHistory={() => setIsHistoryOpen(true)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5">
            <CoverLetterForm
              resumes={resumes}
              isLoadingResumes={isLoadingResumes}
              selectedResumeId={selectedResumeId}
              setSelectedResumeId={setSelectedResumeId}
              jobTitle={jobTitle}
              setJobTitle={setJobTitle}
              companyName={companyName}
              setCompanyName={setCompanyName}
              jobDescription={jobDescription}
              setJobDescription={setJobDescription}
              tone={tone}
              setTone={setTone}
              isGenerating={isGenerating}
              onGenerate={handleGenerate}
            />
          </div>

          <div className="lg:col-span-7">
            <CoverLetterPreview
              coverLetter={currentCoverLetter}
              isGenerating={isGenerating}
              onUpdateContent={handleUpdateContent}
              onExport={handleExport}
            />
          </div>
        </div>

        <CoverLetterHistoryModal
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          items={historyItems}
          isLoading={isLoadingHistory}
          onSelect={handleSelectHistoryItem}
          onDelete={handleDeleteHistoryItem}
        />
      </div>
    </MainLayout>
  );
};

export default CoverLetterPage;
