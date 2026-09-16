import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import MainLayout from "../components/layout/MainLayout";
import InterviewSetupForm from "../components/interview/InterviewSetupForm";
import InterviewQuestionCard from "../components/interview/InterviewQuestionCard";
import InterviewFeedbackView from "../components/interview/InterviewFeedbackView";
import resumeService from "../services/resumeService";
import interviewService from "../services/interviewService";
import { InterviewSession, SessionType } from "../types/interview.types";

export const InterviewPage: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [resumes, setResumes] = useState<any[]>([]);
  const [loadingResumes, setLoadingResumes] = useState<boolean>(true);
  const [loadingCreate, setLoadingCreate] = useState<boolean>(false);
  const [submittingAnswers, setSubmittingAnswers] = useState<boolean>(false);
  const [currentSession, setCurrentSession] = useState<InterviewSession | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchResumes = async () => {
      try {
        setLoadingResumes(true);
        const res = await resumeService.getResumes();
        if (isMounted) {
          const list = Array.isArray(res) ? res : res?.data || [];
          setResumes(list);
        }
      } catch (err) {
        console.error("Failed to load user resumes:", err);
        toast.error("Failed to load resumes list.");
      } finally {
        if (isMounted) setLoadingResumes(false);
      }
    };

    fetchResumes();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSetupSubmit = async (data: {
    resumeId: string;
    jobTitle: string;
    companyName: string;
    sessionType: SessionType;
  }) => {
    try {
      setLoadingCreate(true);
      const session = await interviewService.createInterviewSession(data);
      setCurrentSession(session);
      setStep(2);
      toast.success("AI interview questions generated successfully!");
    } catch (err: any) {
      console.error("Error starting session:", err);
      const msg = err?.response?.data?.message || "Failed to generate interview questions. Please try again.";
      toast.error(msg);
    } finally {
      setLoadingCreate(false);
    }
  };

  const handleSubmitAnswers = async (answers: string[]) => {
    if (!currentSession?._id) return;
    try {
      setSubmittingAnswers(true);
      const evalResult = await interviewService.submitAnswers({
        sessionId: currentSession._id,
        answers,
      });
      setCurrentSession((prev) => ({
        ...(prev || {}),
        ...evalResult,
        _id: prev?._id || evalResult._id,
        jobTitle: prev?.jobTitle || evalResult.jobTitle,
        companyName: prev?.companyName || evalResult.companyName,
      }));
      setStep(3);
      toast.success("Evaluation completed!");
    } catch (err: any) {
      console.error("Error submitting answers:", err);
      const msg = err?.response?.data?.message || "Failed to submit answers. Please try again.";
      toast.error(msg);
    } finally {
      setSubmittingAnswers(false);
    }
  };

  const handleRestart = () => {
    setStep(1);
    setCurrentSession(null);
  };

  return (
    <MainLayout>
      <div className="space-y-8 pb-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                AI Interview Prep
              </span>
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                Beta
              </span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Simulate realistic interview scenarios based on your target resume and get instant AI feedback.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 p-1.5 rounded-xl text-xs font-semibold self-start sm:self-auto">
            <span
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                step === 1 ? "bg-blue-600 text-white" : "text-slate-400"
              }`}
            >
              1. Setup
            </span>
            <span className="text-slate-600">➔</span>
            <span
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                step === 2 ? "bg-blue-600 text-white" : "text-slate-400"
              }`}
            >
              2. Q&A Session
            </span>
            <span className="text-slate-600">➔</span>
            <span
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                step === 3 ? "bg-blue-600 text-white" : "text-slate-400"
              }`}
            >
              3. Results
            </span>
          </div>
        </div>

        {step === 1 && (
          <InterviewSetupForm
            resumes={resumes}
            loadingResumes={loadingResumes}
            onSubmit={handleSetupSubmit}
            loading={loadingCreate}
          />
        )}

        {step === 2 && currentSession?.questions && (
          <InterviewQuestionCard
            questions={currentSession.questions}
            jobTitle={currentSession.jobTitle}
            companyName={currentSession.companyName}
            onSubmitAnswers={handleSubmitAnswers}
            submitting={submittingAnswers}
          />
        )}

        {step === 3 && currentSession && (
          <InterviewFeedbackView
            session={currentSession}
            onRestart={handleRestart}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default InterviewPage;
