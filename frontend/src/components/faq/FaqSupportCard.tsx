import React from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Mail, ArrowRight, Clock } from "lucide-react";

export const FaqSupportCard: React.FC = () => {
  return (
    <div className="mt-16 max-w-4xl mx-auto rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 border border-emerald-500/30 p-8 sm:p-10 relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
        <div className="space-y-3 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" />
            24/7 Support • Typical response under 15 mins
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            Still have questions?
          </h3>
          <p className="text-slate-400 text-sm max-w-lg">
            Our technical support and career expert teams are ready to help
            answer your questions or review your CV directly.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <a
            href="mailto:support@cvpulse.ai"
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Mail className="w-4 h-4 text-emerald-400" />
            <span>Email Support</span>
          </a>

          <Link
            to="/pricing"
            className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-emerald-950/50 hover:shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 group"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Try Pro Plan</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FaqSupportCard;
