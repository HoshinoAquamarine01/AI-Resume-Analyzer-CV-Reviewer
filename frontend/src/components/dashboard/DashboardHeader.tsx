import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Target, Upload, ArrowUpRight } from "lucide-react";
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

  const displayName = userProfile?.name || "Job Seeker";

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0f172a] via-[#111c35] to-[#0f172a] border border-slate-800/80 p-6 sm:p-8 shadow-xl">
      
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
       
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {today}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Realtime AI Connected
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back,{" "}
            {loading ? (
              <span className="inline-block w-36 h-7 bg-slate-800 animate-pulse rounded-md align-middle" />
            ) : (
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
                {displayName}
              </span>
            )}{" "}
            👋
          </h1>

          <p className="text-sm text-slate-400 max-w-xl">
            Optimize your resume for ATS screening, generate position-tailored cover letters, and boost your job interview readiness with AI.
          </p>
        </div>

       
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/resumes"
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all hover:scale-[1.02]"
          >
            <Upload className="w-4 h-4" />
            <span>Upload New Resume</span>
          </Link>

          <Link
            to="/ats-match"
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 text-xs sm:text-sm font-semibold transition-all hover:border-slate-600"
          >
            <Target className="w-4 h-4 text-blue-400" />
            <span className="hidden sm:inline">ATS Match</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
