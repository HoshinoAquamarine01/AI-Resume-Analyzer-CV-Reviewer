import React from "react";
import { CheckCircle2, ArrowRight, Sparkles, CreditCard, Calendar, Hash, ShieldCheck } from "lucide-react";
import { PaymentDetails } from "../../hooks/usePaymentCallback";

interface PaymentSuccessCardProps {
  details: PaymentDetails | null;
  countdown: number;
  onNavigate: (path: string) => void;
}

export const PaymentSuccessCard: React.FC<PaymentSuccessCardProps> = ({
  details,
  countdown,
  onNavigate,
}) => {
  const formattedAmount = details
    ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(details.amount)
    : "0 ₫";

  return (
    <div className="w-full max-w-xl mx-auto bg-slate-900/90 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-8 sm:p-10 shadow-[0_0_50px_rgba(16,185,129,0.15)] relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-bounce">
          <CheckCircle2 className="w-12 h-12 text-emerald-400" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" /> Payment Successful
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          {details?.plan || "PRO"} Plan Activated!
        </h2>
        <p className="text-slate-400 text-sm max-w-md mb-8 leading-relaxed">
          Your account has been upgraded. You now have full access to all premium AI optimization features.
        </p>

        <div className="w-full bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 mb-8 text-left space-y-3 text-sm">
          <div className="flex justify-between items-center pb-2.5 border-b border-slate-700/50">
            <span className="text-slate-400 flex items-center gap-2">
              <Hash className="w-4 h-4 text-slate-500" /> Transaction ID:
            </span>
            <span className="font-mono font-medium text-slate-200">{details?.orderId}</span>
          </div>

          <div className="flex justify-between items-center pb-2.5 border-b border-slate-700/50">
            <span className="text-slate-400 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-slate-500" /> Amount Paid:
            </span>
            <span className="font-semibold text-emerald-400 text-base">{formattedAmount}</span>
          </div>

          <div className="flex justify-between items-center pb-2.5 border-b border-slate-700/50">
            <span className="text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-slate-500" /> Payment Method:
            </span>
            <span className="font-medium text-slate-300">{details?.provider || "VNPAY"}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500" /> Plan Valid Until:
            </span>
            <span className="font-medium text-blue-400">{details?.endDate || "30 days from today"}</span>
          </div>
        </div>

        <div className="w-full bg-emerald-950/40 border border-emerald-500/20 rounded-xl p-3.5 mb-8 flex items-center justify-between text-xs text-emerald-300">
          <span>Redirecting to Dashboard in <strong>{countdown}s</strong>...</span>
          <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-1000 ease-linear"
              style={{ width: `${(countdown / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => onNavigate("/dashboard")}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all group"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => onNavigate("/settings")}
            className="w-full py-3.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium border border-slate-700 flex items-center justify-center gap-2 transition-all"
          >
            Manage Subscription
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessCard;
