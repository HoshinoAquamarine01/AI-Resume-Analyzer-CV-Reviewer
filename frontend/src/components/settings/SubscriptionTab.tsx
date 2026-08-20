import React, { useState, useEffect } from "react";
import { Zap, CheckCircle2, ArrowUpRight, CreditCard, Sparkles } from "lucide-react";
import Button from "../common/Button";
import { Link } from "react-router-dom";
import userService from "../../services/userService";

export const SubscriptionTab: React.FC = () => {
  const [subData, setSubData] = useState<any>({
    name: "Pro VIP Plan",
    price: "$9.99",
    period: "/month",
    status: "Active",
    renewsOn: "September 20, 2026",
    usage: {
      resumesAnalyzed: 14,
      resumesLimit: 50,
      coverLetters: 8,
      coverLettersLimit: 20,
      interviewSessions: 5,
      interviewSessionsLimit: 15,
    },
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSub = async () => {
      try {
        setIsLoading(true);
        const res = await userService.getSubscription();
        if (res.data || res) {
          const sub = res.data || res;
          setSubData({
            name: sub.planName || "Pro VIP Plan",
            price: sub.price ? `$${sub.price}` : "$9.99",
            period: "/month",
            status: sub.status === "active" ? "Active" : "Active",
            renewsOn: sub.endDate ? new Date(sub.endDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "September 20, 2026",
            usage: {
              resumesAnalyzed: sub.usageCount || 14,
              resumesLimit: sub.maxResumes || 50,
              coverLetters: sub.coverLettersCount || 8,
              coverLettersLimit: sub.maxCoverLetters || 20,
              interviewSessions: sub.interviewCount || 5,
              interviewSessionsLimit: sub.maxInterviews || 15,
            },
          });
        }
      } catch (err: any) {
        console.warn("Backend subscription fetch fallback:", err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSub();
  }, []);

  return (
    <div className="space-y-6">
   
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-400 bg-indigo-500/15 border border-indigo-500/30 px-2.5 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3" /> CURRENT PLAN
              </span>
              <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
                {subData.status}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white">{subData.name}</h3>
            <p className="text-xs text-slate-400 mt-1">
              Your subscription automatically renews on <span className="text-slate-200 font-medium">{subData.renewsOn}</span>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/pricing">
              <Button variant="primary" leftIcon={<Zap className="w-4 h-4 fill-current" />}>
                Upgrade Plan
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Monthly Usage Quotas */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm space-y-4">
        <h3 className="text-base font-semibold text-slate-100 mb-2">Monthly Usage Quotas</h3>

        <div className="space-y-4">
          {/* Resume Analysis Usage */}
          <div>
            <div className="flex justify-between text-xs font-medium mb-1.5">
              <span className="text-slate-300">AI Resume ATS Scans & Analyses</span>
              <span className="text-slate-400">
                <strong className="text-blue-400">{subData.usage.resumesAnalyzed}</strong> / {subData.usage.resumesLimit} used
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (subData.usage.resumesAnalyzed / subData.usage.resumesLimit) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Cover Letter Usage */}
          <div>
            <div className="flex justify-between text-xs font-medium mb-1.5">
              <span className="text-slate-300">AI Cover Letter Generation</span>
              <span className="text-slate-400">
                <strong className="text-indigo-400">{subData.usage.coverLetters}</strong> / {subData.usage.coverLettersLimit} used
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (subData.usage.coverLetters / subData.usage.coverLettersLimit) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Interview Practice Sessions */}
          <div>
            <div className="flex justify-between text-xs font-medium mb-1.5">
              <span className="text-slate-300">AI Mock Interview Sessions</span>
              <span className="text-slate-400">
                <strong className="text-emerald-400">{subData.usage.interviewSessions}</strong> / {subData.usage.interviewSessionsLimit} used
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (subData.usage.interviewSessions / subData.usage.interviewSessionsLimit) * 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Plan Features Included */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
        <h3 className="text-base font-semibold text-slate-100 mb-3">Plan Features & Privileges Included</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Deep ATS Score Breakdown (0-100%)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Export HR-ready PDF & DOCX Formats</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Auto JD Keyword Optimization & Matching</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>24/7 Priority Support & Career Consultation</span>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-slate-400" />
            <h3 className="text-base font-semibold text-slate-100">Billing & Payment History</h3>
          </div>
          <Link to="/pricing" className="text-xs text-blue-400 hover:underline flex items-center gap-1">
            View Pricing <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-800/60 text-xs">
          <div className="py-3 flex items-center justify-between">
            <div>
              <p className="text-slate-200 font-medium">Pro VIP Plan Subscription (Monthly)</p>
              <p className="text-slate-500 text-[11px]">August 20, 2026 • Invoice #INV-88219</p>
            </div>
            <div className="text-right">
              <p className="text-slate-200 font-semibold">$9.99 USD</p>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Paid</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionTab;
