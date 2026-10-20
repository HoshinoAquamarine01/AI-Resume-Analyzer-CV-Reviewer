import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  Search,
  Bell,
  CreditCard,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Plus,
} from "lucide-react";
import userService from "../../services/userService";

interface NavbarProps {
  onOpenMobileSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenMobileSidebar }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      try {
        const res = await userService.getProfile();
        const data = res?.data || res;
        if (isMounted && data) {
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        }
      } catch {
        const userJson = localStorage.getItem("user") || sessionStorage.getItem("user");
        if (userJson && isMounted) {
          try {
            setUser(JSON.parse(userJson));
          } catch {}
        }
      }
    };
    fetchUser();
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

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0b0f19]/80 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 flex items-center justify-between">
     
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

     
        <div className="relative w-full hidden sm:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search resumes, ATS reports, tips..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
     
        <Link
          to="/resumes"
          className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Upload CV</span>
        </Link>

    
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-[#0b0f19]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#0d1322] border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Notifications</h4>
                <span className="text-[10px] text-blue-400 font-medium bg-blue-500/10 px-2 py-0.5 rounded-full">
                  2 New
                </span>
              </div>
              <div className="py-2 space-y-2 max-h-64 overflow-y-auto">
                <div className="p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800/70 transition-colors">
                  <div className="text-xs font-medium text-slate-200">ATS Analysis Completed</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Your resume scored 88% match for Senior Frontend Developer.</div>
                  <span className="text-[9px] text-slate-500 mt-1 block">10 mins ago</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800/70 transition-colors">
                  <div className="text-xs font-medium text-slate-200">Welcome to ResumAI Pro!</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Start by uploading your current resume.</div>
                  <span className="text-[9px] text-slate-500 mt-1 block">1 hour ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl text-slate-300 hover:bg-slate-800/60 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-md">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <span className="hidden sm:inline text-xs font-medium text-slate-200 max-w-[120px] truncate">
              {user?.name || "User Account"}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-[#0d1322] border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-3 py-2 border-b border-slate-800/80 mb-1">
                <div className="text-xs font-semibold text-slate-200 truncate">{user?.name || "User"}</div>
                <div className="text-[10px] text-slate-400 truncate">{user?.email || "user@example.com"}</div>
              </div>
              <Link
                to="/settings"
                onClick={() => setShowUserDropdown(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                <User className="w-4 h-4 text-slate-400" />
                Profile Settings
              </Link>
              <Link
                to="/pricing"
                onClick={() => setShowUserDropdown(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                <CreditCard className="w-4 h-4 text-blue-400" />
                Subscription Plan
              </Link>
              <div className="my-1 border-t border-slate-800/80" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

