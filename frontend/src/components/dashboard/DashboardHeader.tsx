import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Target, Upload, ArrowUpRight, CheckCircle2 } from "lucide-react";
import userService from "../../services/userService";

export const DashboardHeader: React.FC = () => {
  const [userProfile, setUserProfile] = useState<{ name: string; email: string; role?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      try {
        const res = await userService.getProfile();
        const data = res?.data || res;
        if (isMounted && data) {
          setUserProfile(data);
          localStorage.setItem("user", JSON.stringify(data));
        }
      } catch (err) {
        const userJson = localStorage.getItem("user") || sessionStorage.getItem("user");
        if (userJson && isMounted) {
          try {
            setUserProfile(JSON.parse(userJson));
          } catch {}
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const displayName = userProfile?.name || "Candidate";

  return (
    <div className="saas-card rounded-3xl bg-[#0d1322] border border-slate-800/90 p-6 sm:p-8 shadow-xl relative overflow-hidden">
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
       
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 text-slate-300 border border-slate-800">
              {today}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              ATS Parser Ready
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back,{" "}
            {loading ? (
              <span className="inline-block w-36 h-7 bg-slate-800 animate-pulse rounded-md align-middle" />
            ) : (
              <span className="text-white">
                {displayName}
              </span>
            )}{" "}
            👋
          </h1>

          <p className="text-sm text-slate-400 max-w-xl">
            Evaluate your resume against top ATS standards, align with target job requirements, and boost interview callbacks.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/resumes"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-emerald-950/40 transition-all active:scale-[0.98]"
          >
            <Upload className="w-4 h-4" />
            <span>Upload New Resume</span>
          </Link>

          <Link
            to="/ats-match"
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 text-xs sm:text-sm font-semibold transition-all hover:border-slate-700"
          >
            <Target className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">ATS Match</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
