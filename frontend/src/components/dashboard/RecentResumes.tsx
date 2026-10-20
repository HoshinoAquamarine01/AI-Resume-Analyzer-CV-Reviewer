import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, ArrowUpRight, Target, Plus, Loader2 } from "lucide-react";
import resumeService from "../../services/resumeService";

export interface ResumeItem {
  id: string;
  title: string;
  targetRole: string;
  atsScore: number;
  updatedAt: string;
  fileSize?: string;
}

export const RecentResumes: React.FC = () => {
  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchResumes = async () => {
      try {
        const response = await resumeService.getResumes(1, 5);
        const data = response?.data || response;
        const list = Array.isArray(data) ? data : data?.resumes || [];

        if (isMounted) {
          const formatted: ResumeItem[] = list.map((item: any) => ({
            id: item._id || item.id,
            title: item.title || item.originalName || "Untitled Resume",
            targetRole: item.personal?.title || item.targetRole || "Software Candidate",
            atsScore: item.atsScore ?? item.aiScore ?? item.score ?? 75,
            updatedAt: item.updatedAt
              ? new Date(item.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
              : "Recently",
            fileSize: item.fileSize ? `${Math.round(item.fileSize / 1024)} KB` : "PDF Document",
          }));
          setResumes(formatted);
        }
      } catch (err) {
        console.error("Failed to load real resumes:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchResumes();

    return () => {
      isMounted = false;
    };
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 85) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    if (score >= 70) return "bg-blue-500/10 text-blue-400 border-blue-500/30";
    return "bg-amber-500/10 text-amber-400 border-amber-500/30";
  };

  return (
    <div className="p-6 rounded-3xl bg-[#0d1322]/80 border border-slate-800/80 backdrop-blur-md shadow-xl flex flex-col justify-between min-h-[320px]">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" />
              Recent Resumes
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Your uploaded CVs & ATS reports</p>
          </div>

          <Link
            to="/resumes"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400 space-y-3">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
            <span className="text-xs">Loading resumes from database...</span>
          </div>
        ) : resumes.length === 0 ? (
          <div className="py-10 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-200">No resumes uploaded yet</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Upload your first CV to start analyzing ATS match score and getting AI recommendations.
              </p>
            </div>
            <Link
              to="/resumes"
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Upload First CV</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 group-hover:scale-105 transition-transform">
                    <FileText className="w-5 h-5" />
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-200 truncate group-hover:text-white transition-colors">
                      {resume.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span>{resume.targetRole}</span>
                      <span>•</span>
                      <span className="font-mono text-[10px]">{resume.updatedAt}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${getScoreColor(resume.atsScore)} flex items-center gap-1`}>
                    <span>{resume.atsScore}% ATS</span>
                  </div>

                  <Link
                    to="/ats-match"
                    title="Match against Job Description"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors hidden sm:block"
                  >
                    <Target className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 pt-4 border-t border-slate-800/80 text-center">
        <Link
          to="/resumes"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <span>Need to update a resume? Upload new version</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default RecentResumes;
