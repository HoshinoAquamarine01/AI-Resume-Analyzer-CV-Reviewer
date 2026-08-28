import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import MainLayout from "../components/layout/MainLayout";
import AtsHeader from "../components/ats/AtsHeader";
import AtsInputSection, { ResumeOption } from "../components/ats/AtsInputSection";
import AtsScoreGauge from "../components/ats/AtsScoreGauge";
import AtsKeywordsBreakdown from "../components/ats/AtsKeywordsBreakdown";
import AtsSuggestionsList from "../components/ats/AtsSuggestionsList";

import resumeService from "../services/resumeService";
import aiService, { AtsOptimizationResult } from "../services/aiService";
import { Target, Sparkles } from "lucide-react";

export const AtsMatchPage: React.FC = () => {
  const [resumes, setResumes] = useState<ResumeOption[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [jobDescription, setJobDescription] = useState<string>("");

  const [isLoadingResumes, setIsLoadingResumes] = useState<boolean>(true);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AtsOptimizationResult | null>(null);

  
  useEffect(() => {
    let isMounted = true;

    const fetchUserResumes = async () => {
      try {
        setIsLoadingResumes(true);
        const response = await resumeService.getResumes(1, 50);

        if (isMounted) {
          const list = response?.data?.resumes || response?.data || response?.resumes || [];
          setResumes(list);

          
          if (list.length > 0) {
            setSelectedResumeId(list[0]._id);
          }
        }
      } catch (err: any) {
        console.error("Failed to fetch resumes:", err);
        if (isMounted) {
          toast.error("Failed to load your resumes. Please try refreshing the page.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingResumes(false);
        }
      }
    };

    fetchUserResumes();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRunAnalysis = async () => {
    if (!selectedResumeId) {
      toast.error("Please select a resume.");
      return;
    }
    if (!jobDescription.trim()) {
      toast.error("Please enter a job description.");
      return;
    }

    try {
      setIsAnalyzing(true);
      toast.loading("Analyzing resume against job description...", { id: "ats-scan" });

      const result = await aiService.optimizeForAts(selectedResumeId, jobDescription);

      setAnalysisResult(result);
      toast.success("ATS scan completed successfully!", { id: "ats-scan" });
    } catch (err: any) {
      console.error("ATS analysis error:", err);
      const errMsg = err?.response?.data?.message || err?.message || "Failed to analyze ATS match.";
      toast.error(errMsg, { id: "ats-scan" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-8 pb-12">
       
        <AtsHeader />

      
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
         
          <div className="lg:col-span-5 space-y-6">
            <AtsInputSection
              resumes={resumes}
              selectedResumeId={selectedResumeId}
              onSelectResume={setSelectedResumeId}
              jobDescription={jobDescription}
              onChangeJobDescription={setJobDescription}
              onAnalyze={handleRunAnalysis}
              isAnalyzing={isAnalyzing}
              isLoadingResumes={isLoadingResumes}
            />
          </div>

         
          <div className="lg:col-span-7 space-y-6">
            {analysisResult ? (
              <>
                <AtsScoreGauge
                  score={analysisResult.atsScore}
                  matchedCount={analysisResult.matchingKeywords.length}
                  missingCount={analysisResult.missingKeywords.length}
                />

                <AtsKeywordsBreakdown
                  matchingKeywords={analysisResult.matchingKeywords}
                  missingKeywords={analysisResult.missingKeywords}
                />

                <AtsSuggestionsList suggestions={analysisResult.suggestions} />
              </>
            ) : (
             
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-10 text-center flex flex-col items-center justify-center min-h-[420px] space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-inner">
                  <Target className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Ready for ATS Matching</h3>
                <p className="text-sm text-slate-400 max-w-md">
                  Select your target resume on the left, paste the job description, and click{" "}
                  <strong className="text-slate-200 font-semibold">"Scan ATS Match & Optimize"</strong> to view real-time score analytics.
                </p>
                <div className="pt-2 flex items-center gap-2 text-xs text-indigo-400 font-medium">
                  <Sparkles className="w-4 h-4" />
                  Powered by Gemini AI Engine
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AtsMatchPage;
