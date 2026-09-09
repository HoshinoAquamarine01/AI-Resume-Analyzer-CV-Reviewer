import React, { useState } from "react";
import {
  FileText,
  KeyRound,
  Sparkles,
  MessageSquare,
  User,
  CreditCard,
  Globe,
  ChevronDown,
  ChevronUp,
  Clock,
  Terminal,
} from "lucide-react";
import { ActivityLogItem } from "../../types/activityLog";

interface ActivityLogItemCardProps {
  item: ActivityLogItem;
}

export const ActivityLogItemCard: React.FC<ActivityLogItemCardProps> = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

 
  const getActionMeta = (actionStr: string) => {
    const act = (actionStr || "").toLowerCase();

    if (act.includes("login") || act.includes("auth") || act.includes("register") || act.includes("password")) {
      return {
        title: actionStr.replaceAll(".", " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        icon: KeyRound,
        badgeBg: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        category: "Authentication",
      };
    }
    if (act.includes("resume") || act.includes("ats") || act.includes("upload") || act.includes("parse")) {
      return {
        title: actionStr.replaceAll(".", " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        icon: FileText,
        badgeBg: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
        category: "Resume & ATS",
      };
    }
    if (act.includes("cover") || act.includes("letter")) {
      return {
        title: actionStr.replaceAll(".", " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        icon: Sparkles,
        badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        category: "Cover Letter",
      };
    }
    if (act.includes("interview") || act.includes("question")) {
      return {
        title: actionStr.replaceAll(".", " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        icon: MessageSquare,
        badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        category: "AI Interview",
      };
    }
    if (act.includes("payment") || act.includes("subscription")) {
      return {
        title: actionStr.replaceAll(".", " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        icon: CreditCard,
        badgeBg: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        category: "Payment",
      };
    }

    return {
      title: actionStr.replaceAll(".", " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      icon: User,
      badgeBg: "bg-slate-500/10 text-slate-300 border-slate-500/20",
      category: "Account & Profile",
    };
  };

  const meta = getActionMeta(item.action);
  const IconComponent = meta.icon;

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }).format(d);
    } catch {
      return dateStr;
    }
  };

  const hasDetails = item.details && Object.keys(item.details).length > 0;

  return (
    <div className="relative group bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-4 sm:p-5 transition-all duration-200 shadow-md">
      <div className="flex items-start gap-4">
      
        <div className="w-10 h-10 rounded-xl bg-slate-800/90 border border-slate-700/80 flex items-center justify-center text-slate-300 shrink-0 group-hover:border-blue-500/40 group-hover:text-blue-400 transition-colors">
          <IconComponent className="w-5 h-5" />
        </div>

      
        <div className="flex-1 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-100 text-sm sm:text-base tracking-tight">
                {meta.title}
              </h3>
              <span className={`px-2 py-0.5 rounded-md text-[11px] font-mono border ${meta.badgeBg}`}>
                {meta.category}
              </span>
            </div>

          
            <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
              {item.ipAddress && (
                <span className="inline-flex items-center gap-1 bg-slate-800/60 px-2 py-0.5 rounded text-[11px] text-slate-400 border border-slate-800">
                  <Globe className="w-3 h-3 text-slate-400" />
                  {item.ipAddress}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                {formatDate(item.createdAt)}
              </span>
            </div>
          </div>

          
          {hasDetails && (
            <div className="mt-3">
              <button
                onClick={() => setExpanded(!expanded)}
                className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>{expanded ? "Hide event details" : "View payload details"}</span>
                {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {expanded && (
                <div className="mt-2.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto custom-scrollbar">
                  <pre className="text-[11px] leading-relaxed text-slate-300">
                    {JSON.stringify(item.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityLogItemCard;
