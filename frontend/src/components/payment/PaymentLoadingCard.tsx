import React from "react";
import { Loader2, ShieldCheck } from "lucide-react";

export const PaymentLoadingCard: React.FC = () => {
  return (
    <div className="w-full max-w-lg mx-auto bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl text-center relative overflow-hidden">
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center animate-pulse">
            <ShieldCheck className="w-10 h-10 text-blue-400" />
          </div>
          <Loader2 className="w-24 h-24 text-blue-500 animate-spin absolute -top-2 -left-2 stroke-[1.5]" />
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">Verifying Transaction...</h2>
        <p className="text-slate-400 text-sm max-w-sm mb-6 leading-relaxed">
          Our system is verifying the digital checksum signature (HMAC-SHA512) and activating your plan. Please do not close your browser.
        </p>

        <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 animate-pulse w-3/4"></div>
        </div>
      </div>
    </div>
  );
};

export default PaymentLoadingCard;
