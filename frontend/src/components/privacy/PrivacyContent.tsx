import React from "react";
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Cpu,
  Trash2,
  Cookie,
  UserCheck,
  Mail,
  CheckCircle2,
  FileCheck2,
  KeyRound,
} from "lucide-react";
import { PrivacySectionItem } from "./PrivacySidebar";

export const PRIVACY_SECTIONS: PrivacySectionItem[] = [
  { id: "data-collection", title: "Information We Collect", number: "01" },
  { id: "data-usage", title: "How We Use Your Resume Data", number: "02" },
  { id: "data-security", title: "Security & Encryption Standards", number: "03" },
  { id: "zero-selling", title: "Zero Third-Party Data Selling", number: "04" },
  { id: "ai-processing", title: "AI Model & Processing Privacy", number: "05" },
  { id: "retention", title: "Data Retention & Erasure", number: "06" },
  { id: "cookies", title: "Cookies & Analytics", number: "07" },
  { id: "user-rights", title: "Your Privacy Rights (GDPR / CCPA)", number: "08" },
  { id: "contact-privacy", title: "Privacy Contact & Enquiries", number: "09" },
];

export const PrivacyContent: React.FC = () => {
  return (
    <div className="flex-1 space-y-10 text-slate-300 text-sm leading-relaxed">
      
    
      <section id="data-collection" className="p-6 sm:p-8 rounded-2xl bg-[#0d1322] border border-slate-800/80 shadow-xl scroll-mt-28">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono font-bold text-xs">
            01
          </div>
          <h2 className="text-xl font-bold text-white">Information We Collect</h2>
        </div>
        <p className="mb-4">
          When you use <strong className="text-white">ResumAI / CVPulse</strong>, we collect specific types of information to provide and improve our AI resume optimization services:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <h4 className="font-bold text-slate-200 text-xs mb-1.5 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-emerald-400" />
              Uploaded CV & Resume Files
            </h4>
            <p className="text-xs text-slate-400">
              PDF or DOCX documents uploaded for text extraction, ATS parsing, and cover letter tailoring.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <h4 className="font-bold text-slate-200 text-xs mb-1.5 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              Account Credentials
            </h4>
            <p className="text-xs text-slate-400">
              Your name, email address, hashed passwords, and subscription metadata.
            </p>
          </div>
        </div>
      </section>

    
      <section id="data-usage" className="p-6 sm:p-8 rounded-2xl bg-[#0d1322] border border-slate-800/80 shadow-xl scroll-mt-28">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono font-bold text-xs">
            02
          </div>
          <h2 className="text-xl font-bold text-white">How We Use Your Resume Data</h2>
        </div>
        <p className="mb-4">
          Your uploaded documents and personal information are strictly used for the following legitimate purposes:
        </p>
        <ul className="space-y-2.5 mb-4 pl-2">
          <li className="flex items-start gap-2.5 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <span>Parsing text content to compute ATS match scores against target job descriptions.</span>
          </li>
          <li className="flex items-start gap-2.5 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <span>Generating tailored cover letters and interview preparation questions.</span>
          </li>
          <li className="flex items-start gap-2.5 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <span>Maintaining account history so you can review and export previous CV evaluations.</span>
          </li>
        </ul>
      </section>

    
      <section id="data-security" className="p-6 sm:p-8 rounded-2xl bg-[#0d1322] border border-slate-800/80 shadow-xl scroll-mt-28">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono font-bold text-xs">
            03
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Security & Encryption Standards</span>
            <Lock className="w-4 h-4 text-emerald-400" />
          </h2>
        </div>
        <p className="mb-4">
          We employ enterprise-grade security protocols to protect your documents and personal data from unauthorized access:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-xs">
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
            <h4 className="font-bold text-emerald-200 mb-1 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-emerald-400" />
              Encryption in Transit
            </h4>
            <p className="text-emerald-300/80">
              All browser communications use TLS 1.3 / HTTPS 256-bit encryption.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
            <h4 className="font-bold text-emerald-200 mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Encryption at Rest
            </h4>
            <p className="text-emerald-300/80">
              Files uploaded to servers are stored using AES-256 encrypted storage buckets.
            </p>
          </div>
        </div>
      </section>

    
      <section id="zero-selling" className="p-6 sm:p-8 rounded-2xl bg-[#0d1322] border border-slate-800/80 shadow-xl scroll-mt-28">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono font-bold text-xs">
            04
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Zero Third-Party Data Selling</span>
            <EyeOff className="w-4 h-4 text-emerald-400" />
          </h2>
        </div>

        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs leading-relaxed mb-4">
          <strong className="block font-bold text-emerald-300 mb-1">Strict Zero-Sale Guarantee:</strong>
          We never sell, rent, lease, or monetize your resume text, contact details, or personal job application data to external recruiters, marketing agencies, or data brokers.
        </div>
        <p className="text-xs text-slate-400">
          Your resumes remain confidential and are accessible only by you and the secure automated parsers operating on your account.
        </p>
      </section>


      <section id="ai-processing" className="p-6 sm:p-8 rounded-2xl bg-[#0d1322] border border-slate-800/80 shadow-xl scroll-mt-28">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono font-bold text-xs">
            05
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>AI Model & Processing Privacy</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </h2>
        </div>
        <p className="mb-4">
          When AI algorithms (such as LLM prompts for CV improvement or interview simulation) process your document text:
        </p>
        <ul className="space-y-2 mb-4 text-xs pl-2">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Your personal data is **NOT** used to train public, open-source AI models.</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>AI API processing is stateless and restricted to immediate evaluation requests.</span>
          </li>
        </ul>
      </section>

     
      <section id="retention" className="p-6 sm:p-8 rounded-2xl bg-[#0d1322] border border-slate-800/80 shadow-xl scroll-mt-28">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-mono font-bold text-xs">
            06
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Data Retention & Erasure</span>
            <Trash2 className="w-4 h-4 text-rose-400" />
          </h2>
        </div>
        <p className="mb-4">
          You have full control over your stored documents and account data:
        </p>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs mb-3">
          <strong className="block text-slate-200 font-semibold mb-1">Cascade Delete Account:</strong>
          If you delete your account via Account Settings, our backend instantly performs a complete cascade wipe—permanently removing all your resumes, cover letters, analysis logs, and physical server files.
        </div>
      </section>

      
      <section id="cookies" className="p-6 sm:p-8 rounded-2xl bg-[#0d1322] border border-slate-800/80 shadow-xl scroll-mt-28">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono font-bold text-xs">
            07
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Cookies & Technical Analytics</span>
            <Cookie className="w-4 h-4 text-emerald-400" />
          </h2>
        </div>
        <p>
          We use essential session tokens (JWT in LocalStorage/SessionStorage) to maintain your authenticated login state. We do not use intrusive third-party tracking cookies across external websites.
        </p>
      </section>

    
      <section id="user-rights" className="p-6 sm:p-8 rounded-2xl bg-[#0d1322] border border-slate-800/80 shadow-xl scroll-mt-28">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono font-bold text-xs">
            08
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Your Privacy Rights (GDPR / CCPA)</span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </h2>
        </div>
        <p className="mb-3">Under global data protection regulations, you possess the right to:</p>
        <ul className="space-y-2 text-xs pl-2">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Request a copy of all personal data held about you (Right to Access & Data Portability).</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Request permanent erasure of all stored CVs and account records (Right to be Forgotten).</span>
          </li>
        </ul>
      </section>

    
      <section id="contact-privacy" className="p-6 sm:p-8 rounded-2xl bg-[#0d1322] border border-slate-800/80 shadow-xl scroll-mt-28">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono font-bold text-xs">
            09
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Privacy Contact & Enquiries</span>
            <Mail className="w-4 h-4 text-emerald-400" />
          </h2>
        </div>
        <p className="mb-4">
          For any data protection inquiries, GDPR compliance requests, or privacy concerns, please contact our Data Protection Officer:
        </p>
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3 text-xs">
          <Mail className="w-4 h-4 text-emerald-400" />
          <span>Email: <strong className="text-white">privacy@cvpulse.ai</strong> or <strong className="text-white">dpo@resumai.pro</strong></span>
        </div>
      </section>

    </div>
  );
};

export default PrivacyContent;
