import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Target,
  Sparkles,
  MessageSquareCode,
  Settings,
  CreditCard,
  History,
  LogOut,
  ChevronRight,
  Zap,
  X,
  Layers,
} from "lucide-react";
import userService from "../../services/userService";

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, onCloseMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
  const [subscription, setSubscription] = useState<{ plan?: string; status?: string } | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadUserData = async () => {
      try {
        const [profileRes, subRes] = await Promise.allSettled([
          userService.getProfile(),
          userService.getSubscription(),
        ]);

        if (isMounted) {
          if (profileRes.status === "fulfilled" && profileRes.value) {
            const data = profileRes.value?.data || profileRes.value;
            setUser(data);
            localStorage.setItem("user", JSON.stringify(data));
          } else {
            const userJson = localStorage.getItem("user") || sessionStorage.getItem("user");
            if (userJson) setUser(JSON.parse(userJson));
          }

          if (subRes.status === "fulfilled" && subRes.value) {
            setSubscription(subRes.value?.data || subRes.value);
          }
        }
      } catch (err) {
        console.error("Failed to load user info in sidebar:", err);
      }
    };

    loadUserData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  const navItems = [
    {
      label: "Overview",
      path: "/dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      label: "My Resumes",
      path: "/resumes",
      icon: FileText,
      badge: "3",
    },
    {
      label: "CV Templates",
      path: "/templates",
      icon: Layers,
      badge: "New",
    },
    {
      label: "ATS Matcher",
      path: "/ats-match",
      icon: Target,
      badge: "AI",
    },
    {
      label: "Cover Letter",
      path: "/cover-letter",
      icon: Sparkles,
      badge: null,
    },
    {
      label: "AI Interview Prep",
      path: "/interview",
      icon: MessageSquareCode,
      badge: "Beta",
    },
  ];

  const secondaryNavItems = [
    {
      label: "Activity Log",
      path: "/activity-log",
      icon: History,
    },
    {
      label: "Plans & Billing",
      path: "/pricing",
      icon: CreditCard,
    },
    {
      label: "Settings",
      path: "/settings",
      icon: Settings,
    },
  ];

  return (
    <>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0b0f19]/95 backdrop-blur-md border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
  
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800/60">
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <div>
              <span className="font-bold text-white tracking-wide text-base block leading-none">
                ResumAI <span className="text-xs text-blue-400 font-medium">PRO</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase mt-1 block">
                CV & ATS Optimizer
              </span>
            </div>
          </Link>

     
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

       
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 custom-scrollbar">
        
          <div>
            <div className="px-3 mb-2 text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
              Main Menu
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onCloseMobile}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                      isActive
                        ? "bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-md shadow-blue-500/5"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive ? "text-blue-400" : "text-slate-400 group-hover:text-slate-200"
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                          item.badge === "AI" || item.badge === "Beta"
                            ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                            : "bg-slate-800 text-slate-300"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

     
          <div>
            <div className="px-3 mb-2 text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
              Preferences
            </div>
            <nav className="space-y-1">
              {secondaryNavItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onCloseMobile}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                      isActive
                        ? "bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-md shadow-blue-500/5"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive ? "text-blue-400" : "text-slate-400 group-hover:text-slate-200"
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>

          
          <div className="p-3.5 rounded-2xl bg-gradient-to-b from-slate-900 to-[#0d1527] border border-slate-800 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all" />
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                Free Plan
              </span>
              <span className="text-[10px] text-slate-400 font-mono">2/5 Scans</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-3">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full w-[40%] rounded-full" />
            </div>
            <Link
              to="/pricing"
              className="block w-full py-1.5 text-center text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md shadow-blue-600/20 transition-colors"
            >
              Upgrade to Pro
            </Link>
          </div>
        </div>

    
        <div className="p-4 border-t border-slate-800/60 bg-[#090d16]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-sm shrink-0 shadow-md">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="overflow-hidden">
                <div className="text-sm font-semibold text-slate-200 truncate">{user?.name || "User"}</div>
                <div className="text-[11px] text-slate-400 truncate">{user?.email || "user@example.com"}</div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

