import React from "react";
import {
  AlertTriangle,
  Lock,
  Sparkles,
  CreditCard,
  Scale,
  UserCheck,
  Ban,
  Mail,
  CheckCircle2,
} from "lucide-react";
import { SectionItem } from "./TermsSidebar";

export const TERMS_SECTIONS: SectionItem[] = [
  { id: "acceptance", title: "Acceptance of Terms", number: "01" },
  { id: "account", title: "User Account & Security", number: "02" },
  { id: "user-content", title: "User Content & Resume Ownership", number: "03" },
  { id: "ai-disclaimer", title: "AI Analysis & Recommendations", number: "04" },
  { id: "subscription", title: "Subscriptions & Billing", number: "05" },
  { id: "prohibited", title: "Prohibited Conduct", number: "06" },
  { id: "intellectual", title: "Intellectual Property Rights", number: "07" },
  { id: "liability", title: "Limitation of Liability", number: "08" },
  { id: "contact", title: "Contact Information", number: "09" },
];

export const TermsContent: React.FC = () => {
  return (
    <div className="flex-1 space-y-10 text-slate-300 text-sm leading-relaxed">
      
   
      <section id="acceptance" className="p-6 sm:p-8 rounded-2xl bg-[#0d1322] border border-slate-800/80 shadow-xl scroll-mt-28">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-mono font-bold text-xs">
            01
          </div>
          <h2 className="text-xl font-bold text-white">Acceptance of Terms</h2>
        </div>
        <p className="mb-4">
          Welcome to <strong className="text-white">ResumAI / CVPulse</strong> ("Platform", "we", "us", or "our"). By accessing or using our website, web application, API services, and AI-assisted career tools, you ("User", "you") agree to be bound by these Terms of Service ("Terms") and our Privacy Policy.
        </p>
        <p>
          If you do not agree with any part of these Terms, you must discontinue your use of the Platform immediately. We reserve the right to modify these Terms at any time. Continued use after changes take effect constitutes acceptance of the revised Terms.
        </p>
      </section>

     
      <section id="account" className="p-6 sm:p-8 rounded-2xl bg-[#0d1322] border border-slate-800/80 shadow-xl scroll-mt-28">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-mono font-bold text-xs">
            02
          </div>
          <h2 className="text-xl font-bold text-white">User Account & Security</h2>
        </div>
        <p className="mb-4">
          To access core features such as ATS resume scanning, cover letter generation, and interview preparation, you must register for an account:
        </p>
        <ul className="space-y-2.5 mb-4 pl-2">
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <span>You must provide accurate, current, and complete registration information.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <span>You are responsible for safeguarding your account login credentials.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <span>You must notify us immediately of any unauthorized access or breach of security.</span>
          </li>
        </ul>
        <p className="text-xs text-slate-400 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
          We will not be liable for any losses caused by unauthorized use of your account.
        </p>
      </section>

     
      <section id="user-content" className="p-6 sm:p-8 rounded-2xl bg-[#0d1322] border border-slate-800/80 shadow-xl scroll-mt-28">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-mono font-bold text-xs">
            03
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>User Content & Resume Ownership</span>
            <Lock className="w-4 h-4 text-emerald-400" />
          </h2>
        </div>
        <p className="mb-4">
          You retain full ownership of all resumes, CV files, text, cover letters, and personal documents you upload or submit to the Platform ("User Content").
        </p>
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs leading-relaxed mb-4">
          <strong className="block font-semibold mb-1 text-emerald-200">Our Data Commitment:</strong>
          We do not sell, rent, or trade your personal resume data or contact information to third-party recruiters or data brokers.
        </div>
        <p>
          By uploading content, you grant us a limited, worldwide, non-exclusive license solely to process, analyze, and generate AI insights for your explicit use on the Platform.
        </p>
      </section>

     
      <section id="ai-disclaimer" className="p-6 sm:p-8 rounded-2xl bg-[#0d1322] border border-slate-800/80 shadow-xl scroll-mt-28">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-mono font-bold text-xs">
            04
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>AI Analysis & Recommendations Disclaimer</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </h2>
        </div>

      
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs leading-relaxed mb-5 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold text-amber-300 mb-0.5">Important Notice regarding AI Output:</strong>
            All ATS compatibility scores, keyword suggestions, cover letter drafts, and mock interview feedback are generated by automated artificial intelligence models and are advisory in nature.
          </div>
        </div>

        <p className="mb-3">
          While we strive to maximize parsing accuracy and recruitment alignment:
        </p>
        <ul className="space-y-2 mb-4 pl-2 text-xs">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>We do not guarantee job placement, interview callbacks, or hiring decisions.</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>ATS match percentages are estimates based on algorithmic heuristics.</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Users must review and verify AI-generated suggestions prior to job application submissions.</span>
          </li>
        </ul>
      </section>

      
      <section id="subscription" className="p-6 sm:p-8 rounded-2xl bg-[#0d1322] border border-slate-800/80 shadow-xl scroll-mt-28">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-mono font-bold text-xs">
            05
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Subscriptions & Billing</span>
            <CreditCard className="w-4 h-4 text-blue-400" />
          </h2>
        </div>
        <p className="mb-4">
          We offer Free and Paid Subscription plans (e.g. Pro, Premium). By subscribing to a paid plan:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <h4 className="font-bold text-slate-200 mb-1">Billing Cycle</h4>
            <p className="text-slate-400">Fees are billed in advance on a recurring monthly or annual basis until canceled.</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <h4 className="font-bold text-slate-200 mb-1">Cancellation</h4>
            <p className="text-slate-400">You may cancel your subscription at any time via Account Settings before your next billing date.</p>
          </div>
        </div>
      </section>

     
      <section id="prohibited" className="p-6 sm:p-8 rounded-2xl bg-[#0d1322] border border-slate-800/80 shadow-xl scroll-mt-28">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-mono font-bold text-xs">
            06
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Prohibited Conduct</span>
            <Ban className="w-4 h-4 text-rose-400" />
          </h2>
        </div>
        <p className="mb-3">You agree not to engage in any of the following prohibited actions:</p>
        <ul className="space-y-2 text-xs pl-2">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            <span>Attempting to reverse engineer, decompile, or scrape the Platform's software or AI models.</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            <span>Uploading malicious files containing viruses, malware, or corrupted code.</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            <span>Submitting fraudulent identity details or unauthorized third-party resumes.</span>
          </li>
        </ul>
      </section>

      
      <section id="intellectual" className="p-6 sm:p-8 rounded-2xl bg-[#0d1322] border border-slate-800/80 shadow-xl scroll-mt-28">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-mono font-bold text-xs">
            07
          </div>
          <h2 className="text-xl font-bold text-white">Intellectual Property Rights</h2>
        </div>
        <p>
          All trademarks, logos, UI designs, codebases, ATS evaluation algorithms, and proprietary software associated with the Platform remain the sole intellectual property of ResumAI / CVPulse. You may not copy or redistribute our software without prior written authorization.
        </p>
      </section>

      
      <section id="liability" className="p-6 sm:p-8 rounded-2xl bg-[#0d1322] border border-slate-800/80 shadow-xl scroll-mt-28">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-mono font-bold text-xs">
            08
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Limitation of Liability</span>
            <Scale className="w-4 h-4 text-blue-400" />
          </h2>
        </div>
        <p>
          To the maximum extent permitted by applicable law, ResumAI shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your access to or inability to access the Platform, including loss of data or employment opportunities.
        </p>
      </section>

     
      <section id="contact" className="p-6 sm:p-8 rounded-2xl bg-[#0d1322] border border-slate-800/80 shadow-xl scroll-mt-28">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-mono font-bold text-xs">
            09
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Contact Information</span>
            <Mail className="w-4 h-4 text-blue-400" />
          </h2>
        </div>
        <p className="mb-4">
          If you have any questions or legal inquiries regarding these Terms of Service, please reach out to our team:
        </p>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3 text-xs">
          <Mail className="w-4 h-4 text-blue-400" />
          <span>Email: <strong className="text-white">support@cvpulse.ai</strong> or <strong className="text-white">legal@resumai.pro</strong></span>
        </div>
      </section>

    </div>
  );
};

export default TermsContent;
