import React from "react";
import { XCircle, RefreshCw, ArrowLeft, AlertCircle, Hash, ShieldAlert } from "lucide-react";
import { PaymentDetails } from "../../hooks/usePaymentCallback";

interface PaymentFailedCardProps {
  details: PaymentDetails | null;
  errorMessage: string;
  onRetry: () => void;
  onNavigate: (path: string) => void;
}

export const PaymentFailedCard: React.FC<PaymentFailedCardProps> = ({
  details,
  errorMessage,
  onRetry,
  onNavigate,
}) => {
  return (
    <div className="w-full max-w-xl mx-auto bg-slate-900/90 backdrop-blur-xl border border-rose-500/30 rounded-3xl p-8 sm:p-10 shadow-[0_0_50px_rgba(244,63,94,0.15)] relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-rose-500/10 border-2 border-rose-500/40 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(244,63,94,0.3)]">
          <XCircle className="w-12 h-12 text-rose-400" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-3">
          <ShieldAlert className="w-3.5 h-3.5" /> Transaction Incomplete
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          Payment Failed or Cancelled
        </h2>
        <p className="text-slate-400 text-sm max-w-md mb-6 leading-relaxed">
          We were unable to complete your plan upgrade transaction.
        </p>

        <div className="w-full bg-rose-950/40 border border-rose-500/30 rounded-2xl p-4 mb-6 text-left flex items-start gap-3 text-sm text-rose-200">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-semibold text-rose-300">Failure Reason:</strong>
            <span>{errorMessage || "The transaction was cancelled by the user or timed out."}</span>
          </div>
        </div>

        {details?.orderId && (
          <div className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5 mb-8 flex justify-between items-center text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-slate-500" /> Order ID:
            </span>
            <span className="font-mono text-slate-300 font-medium">{details.orderId}</span>
          </div>
        )}

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={onRetry}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Retry Payment
          </button>
          <button
            onClick={() => onNavigate("/pricing")}
            className="w-full py-3.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium border border-slate-700 flex items-center justify-center gap-2 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Pricing
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailedCard;
