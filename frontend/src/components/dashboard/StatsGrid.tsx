import React, { useEffect, useState } from "react";
import StatCard from "./StatCard";
import { FileText, Target, FileEdit, MessageSquareCode } from "lucide-react";
import resumeService from "../../services/resumeService";
import coverLetterService from "../../services/coverLetterService";
import interviewService from "../../services/interviewService";

export const StatsGrid: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    resumeCount: 0,
    avgAtsScore: 0,
    coverLetterCount: 0,
    interviewCount: 0,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchRealMetrics = async () => {
      try {
        const [resumesRes, coverLettersRes, interviewRes] = await Promise.allSettled([
          resumeService.getResumes(1, 50),
          coverLetterService.getCoverLetters(1, 50),
          interviewService.getInterviewSessions(1, 50),
        ]);

        let resumeCount = 0;
        let avgAtsScore = 0;
        let coverLetterCount = 0;
        let interviewCount = 0;

        const extractListAndTotal = (resValue: any, key: string) => {
          if (!resValue) return { list: [], total: 0 };
          const payload = resValue.data ?? resValue;
          if (Array.isArray(payload)) {
            return { list: payload, total: payload.length };
          }
          const list = Array.isArray(payload?.[key])
            ? payload[key]
            : Array.isArray(resValue?.[key])
            ? resValue[key]
            : [];
          const total = typeof payload?.total === "number"
            ? payload.total
            : typeof resValue?.total === "number"
            ? resValue.total
            : list.length;
          return { list, total };
        };

        if (resumesRes.status === "fulfilled" && resumesRes.value) {
          const { list, total } = extractListAndTotal(resumesRes.value, "resumes");
          resumeCount = total;

          const scoredList = list.filter(
            (r: any) =>
              typeof r.atsScore === "number" ||
              typeof r.aiScore === "number" ||
              typeof r.score === "number"
          );
          if (scoredList.length > 0) {
            const sum = scoredList.reduce(
              (acc: number, cur: any) =>
                acc + (cur.atsScore ?? cur.aiScore ?? cur.score ?? 0),
              0
            );
            avgAtsScore = Math.round(sum / scoredList.length);
          }
        }

        if (coverLettersRes.status === "fulfilled" && coverLettersRes.value) {
          const { total } = extractListAndTotal(coverLettersRes.value, "coverLetters");
          coverLetterCount = total;
        }

        if (interviewRes.status === "fulfilled" && interviewRes.value) {
          const { total } = extractListAndTotal(interviewRes.value, "sessions");
          interviewCount = total;
        }

        if (isMounted) {
          setMetrics({
            resumeCount,
            avgAtsScore,
            coverLetterCount,
            interviewCount,
          });
        }
      } catch (err) {
        console.error("Failed to fetch dashboard metrics:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRealMetrics();

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = [
    {
      title: "Resumes Uploaded",
      value: loading ? "..." : `${metrics.resumeCount} Files`,
      subtitle: metrics.resumeCount === 0 ? "No resumes yet" : "Realtime synced",
      trend: metrics.resumeCount > 0 ? { value: `${metrics.resumeCount} active`, isPositive: true } : undefined,
      icon: FileText,
      iconBgColor: "bg-blue-500/10",
      iconTextColor: "text-blue-400",
    },
    {
      title: "Avg. ATS Score",
      value: loading ? "..." : `${metrics.avgAtsScore}%`,
      progressPercentage: metrics.avgAtsScore,
      icon: Target,
      iconBgColor: "bg-emerald-500/10",
      iconTextColor: "text-emerald-400",
    },
    {
      title: "Cover Letters",
      value: loading ? "..." : `${metrics.coverLetterCount} Letters`,
      subtitle: metrics.coverLetterCount === 0 ? "0 generated" : "Tailored by AI",
      trend: metrics.coverLetterCount > 0 ? { value: `${metrics.coverLetterCount} ready`, isPositive: true } : undefined,
      icon: FileEdit,
      iconBgColor: "bg-purple-500/10",
      iconTextColor: "text-purple-400",
    },
    {
      title: "AI Interview Prep",
      value: loading ? "..." : `${metrics.interviewCount} Sessions`,
      subtitle: metrics.interviewCount === 0 ? "0 practice sessions" : "Mock practice active",
      trend: metrics.interviewCount > 0 ? { value: `${metrics.interviewCount} sessions`, isPositive: true } : undefined,
      icon: MessageSquareCode,
      iconBgColor: "bg-amber-500/10",
      iconTextColor: "text-amber-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {stats.map((stat, idx) => (
        <StatCard key={idx} {...stat} />
      ))}
    </div>
  );
};

export default StatsGrid;
