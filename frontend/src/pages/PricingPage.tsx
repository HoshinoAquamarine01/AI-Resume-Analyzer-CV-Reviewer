import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Check,
  Clock,
  ShieldCheck,
  ArrowLeft,
  QrCode,
  AlertCircle,
  Loader2,
  CheckCircle2,
  HelpCircle,
  Zap,
  Star,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";
import paymentService from "../services/paymentService";
import QrPaymentModal, { QrPaymentData } from "../components/payment/QrPaymentModal";

export const PricingPage: React.FC = () => {
  const navigate = useNavigate();

  const [currentPlan, setCurrentPlan] = useState<string>("free");
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>("active");
  const [pendingPayment, setPendingPayment] = useState<any>(null);
  const [loadingPending, setLoadingPending] = useState<boolean>(true);

  const [qrModalData, setQrModalData] = useState<QrPaymentData | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);
  const [actionLoadingPlan, setActionLoadingPlan] = useState<string | null>(null);

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  const loadUserData = async () => {
    if (!token) {
      setLoadingPending(false);
      return;
    }

    try {
      setLoadingPending(true);
      const [subRes, pendingRes] = await Promise.allSettled([
        paymentService.getSubscriptionStatus(),
        paymentService.getPendingPayment(),
      ]);

      if (subRes.status === "fulfilled" && subRes.value) {
        const subData = subRes.value.data || subRes.value;
        if (subData) {
          setCurrentPlan(subData.plan || "free");
          setSubscriptionStatus(subData.status || "active");
        }
      }

      if (pendingRes.status === "fulfilled" && pendingRes.value) {
        const pData = pendingRes.value.data || pendingRes.value;
        if (pData?.hasPending && pData.pendingPayment) {
          setPendingPayment(pData.pendingPayment);
        } else {
          setPendingPayment(null);
        }
      }
    } catch (err) {
      console.error("Failed to load user subscription/pending payment:", err);
    } finally {
      setLoadingPending(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const handleSelectPlan = async (plan: "pro" | "premium") => {
    if (!token) {
      toast.error("Please sign in to upgrade your subscription.");
      navigate("/login?redirect=/pricing");
      return;
    }

    if (currentPlan === plan && subscriptionStatus === "active") {
      toast.success(`You are currently on the ${plan.toUpperCase()} plan!`);
      return;
    }

    try {
      setActionLoadingPlan(plan);
      const res = await paymentService.createQrPayment(plan);
      const data = res.data || res;

      setQrModalData({
        orderId: data.orderId,
        plan: data.plan,
        amount: data.amount,
        bankAccount: data.bankAccount,
        transferContent: data.transferContent,
        qrCodeUrl: data.qrCodeUrl,
      });
      setIsQrModalOpen(true);
    } catch (err: any) {
      console.error("Create QR payment error:", err);
      toast.error(err?.response?.data?.message || "Failed to generate QR payment code.");
    } finally {
      setActionLoadingPlan(null);
    }
  };

  const handleOpenPendingQr = () => {
    if (!pendingPayment) return;
    setQrModalData({
      orderId: pendingPayment.orderId,
      plan: pendingPayment.plan,
      amount: pendingPayment.amount,
      bankAccount: pendingPayment.bankAccount,
      transferContent: pendingPayment.transferContent,
      qrCodeUrl: pendingPayment.qrCodeUrl,
    });
    setIsQrModalOpen(true);
  };

  const faqs = [
    {
      q: "How does the QR payment and plan activation process work?",
      a: "Once you choose the Pro or Premium plan, our system generates a standard VietQR code prefilled with the exact account number, amount, and unique transfer memo. Scan the code using any mobile banking app or supported e-wallet to transfer. Then click 'I Have Completed Transfer'. An Admin will verify and activate your plan within 2 - 10 minutes.",
    },
    {
      q: "Is the transfer memo / content strictly required?",
      a: "Yes, this is critical! The transfer memo is formatted as 'RESUME XXXXXX' (where XXXXXX is your unique order reference). This code allows our team to identify your account and activate your plan instantly.",
    },
    {
      q: "Can I cancel or switch my plan later?",
      a: "Absolutely. At the end of the 30-day billing cycle, if you do not renew, your account automatically reverts to the Free tier without any recurring charges or hidden fees.",
    },
    {
      q: "What if my plan is not activated after 15 minutes?",
      a: "Don't worry! All bank transactions are logged transparently in our audit system. You can reach out directly via our Contact page or support channel for manual activation in under 1 minute.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
    
      <div className="max-w-7xl mx-auto mb-8 flex items-center justify-between">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        {token && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Current Plan:</span>
            <span
              className={`px-2.5 py-0.5 rounded-full font-bold uppercase ${
                currentPlan === "premium"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : currentPlan === "pro"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-slate-800 text-slate-300 border border-slate-700"
              }`}
            >
              {currentPlan}
            </span>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto space-y-12">
        {pendingPayment && (
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg animate-fade-in">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0 mt-0.5 sm:mt-0">
                <Clock className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>You have an upgrade request awaiting Admin verification</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Pending Review
                  </span>
                </h4>
                <p className="text-xs text-slate-300">
                  Plan <span className="font-bold uppercase text-emerald-400">{pendingPayment.plan}</span> •{" "}
                  Order ID: <span className="font-mono text-white font-semibold">{pendingPayment.orderId}</span> •{" "}
                  Memo: <span className="font-mono text-amber-300 font-bold">{pendingPayment.transferContent}</span>
                </p>
              </div>
            </div>

            <button
              onClick={handleOpenPendingQr}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition-all active:scale-95 shrink-0"
            >
              <QrCode className="w-4 h-4" />
              <span>View Payment QR Code</span>
            </button>
          </div>
        )}

        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Secure Bank QR & Fast Approval</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Choose the right plan for{" "}
            <span className="saas-highlight-emerald">
              your career goals
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Convenient instant payment via bank QR code. Administrators verify and activate full AI features promptly upon transfer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {/* Free Plan */}
          <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-8 flex flex-col justify-between hover:border-slate-700 transition-all duration-300 shadow-xl">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white">Free Starter</h3>
                <p className="text-xs text-slate-400 mt-1">Perfect for candidates starting basic CV optimization.</p>
              </div>

              <div className="flex items-baseline">
                <span className="text-4xl font-extrabold text-white">0 VND</span>
                <span className="text-xs text-slate-500 ml-1.5 font-medium">/ month</span>
              </div>

              <div className="h-px bg-slate-800 w-full" />

              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>5 free AI CV audit credits</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Core ATS compatibility scoring</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Standard resume templates access</span>
                </li>
                <li className="flex items-center gap-2.5 text-slate-500">
                  <span className="w-4 h-4 flex items-center justify-center font-bold">✕</span>
                  <span>Unlimited AI resume analysis</span>
                </li>
                <li className="flex items-center gap-2.5 text-slate-500">
                  <span className="w-4 h-4 flex items-center justify-center font-bold">✕</span>
                  <span>Advanced AI Cover Letter generator</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <button
                disabled={currentPlan === "free"}
                className={`w-full py-3 px-4 rounded-xl font-semibold text-xs transition-all ${
                  currentPlan === "free"
                    ? "bg-slate-800 text-slate-400 cursor-default border border-slate-700/50"
                    : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                }`}
              >
                {currentPlan === "free" ? "Current Plan" : "Get Started Free"}
              </button>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="relative rounded-3xl bg-gradient-to-b from-blue-950/40 via-slate-900 to-slate-900 border-2 border-blue-500 p-8 flex flex-col justify-between shadow-2xl shadow-blue-500/10 md:-translate-y-2 transition-all duration-300">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-white text-white" />
              <span>Most Popular</span>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>Professional (Pro)</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                    AI PRO
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">Optimal choice for active job seekers targeting interview calls.</p>
              </div>

              <div className="flex items-baseline">
                <span className="text-4xl font-extrabold text-white">199,000 VND</span>
                <span className="text-xs text-slate-400 ml-1.5 font-medium">/ month</span>
              </div>

              <div className="h-px bg-slate-800 w-full" />

              <ul className="space-y-3 text-xs text-slate-200">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold text-white">50 AI resume audits / month</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>STAR-method bullet point rewrites</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Smart AI Cover Letter generator</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Role-targeted interview question prediction</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Unlock 10+ ATS & international CV templates</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <button
                disabled={actionLoadingPlan === "pro" || (currentPlan === "pro" && subscriptionStatus === "active")}
                onClick={() => handleSelectPlan("pro")}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg ${
                  currentPlan === "pro" && subscriptionStatus === "active"
                    ? "bg-slate-800 text-emerald-400 border border-emerald-500/40 cursor-default"
                    : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30 active:scale-95"
                }`}
              >
                {actionLoadingPlan === "pro" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <QrCode className="w-4 h-4" />
                )}
                <span>
                  {currentPlan === "pro" && subscriptionStatus === "active"
                    ? "Current Plan (Active)"
                    : pendingPayment && pendingPayment.plan === "pro"
                    ? "View Pending QR"
                    : "Upgrade to Pro (Scan QR)"}
                </span>
              </button>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-8 flex flex-col justify-between hover:border-slate-700 transition-all duration-300 shadow-xl">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>Executive (Premium)</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                    VIP
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">Designed for senior specialists, managers, and power users.</p>
              </div>

              <div className="flex items-baseline">
                <span className="text-4xl font-extrabold text-white">499,000 VND</span>
                <span className="text-xs text-slate-500 ml-1.5 font-medium">/ month</span>
              </div>

              <div className="h-px bg-slate-800 w-full" />

              <ul className="space-y-3 text-xs text-slate-300">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold text-white">Unlimited AI Resume Audits</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Priority ultra-fast AI processing queue</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>AI Mock Interview Simulator</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Unbranded executive PDF audit export</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Dedicated 1-on-1 priority support</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <button
                disabled={actionLoadingPlan === "premium" || (currentPlan === "premium" && subscriptionStatus === "active")}
                onClick={() => handleSelectPlan("premium")}
                className={`w-full py-3 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                  currentPlan === "premium" && subscriptionStatus === "active"
                    ? "bg-slate-800 text-purple-400 border border-purple-500/40 cursor-default"
                    : "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-purple-500/50 active:scale-95"
                }`}
              >
                {actionLoadingPlan === "premium" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <QrCode className="w-4 h-4" />
                )}
                <span>
                  {currentPlan === "premium" && subscriptionStatus === "active"
                    ? "Current Plan (Active)"
                    : pendingPayment && pendingPayment.plan === "premium"
                    ? "View Pending QR"
                    : "Upgrade to Premium (Scan QR)"}
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-8 rounded-3xl bg-slate-900/50 border border-slate-800 max-w-5xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-bold text-white flex items-center justify-center gap-2">
              <QrCode className="w-5 h-5 text-blue-400" />
              <span>QR Payment & Activation Workflow</span>
            </h3>
            <p className="text-xs text-slate-400">Simple, transparent, and secure bank transfer via QR code.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h4 className="text-xs font-bold text-white">Scan VietQR Code</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                The system generates a standard banking QR code with your exact price and unique transaction memo.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h4 className="text-xs font-bold text-white">Confirm Transfer</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                After transferring funds on your banking app, click "I Have Completed Transfer" to notify administrators.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h4 className="text-xs font-bold text-white">Review & Activation</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Admin verifies the transaction and approves within 2 - 10 minutes. All premium AI features unlock immediately.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6 pt-4">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-white flex items-center justify-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-400" />
              <span>Frequently Asked Questions</span>
            </h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left text-xs sm:text-sm font-semibold text-white hover:text-blue-400 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className={`transition-transform duration-200 text-slate-400 ${isOpen ? "rotate-180" : ""}`}>
                      ▼
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/80 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      
      <QrPaymentModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        data={qrModalData}
        onSuccess={() => {
          loadUserData();
        }}
      />
    </div>
  );
};

export default PricingPage;
