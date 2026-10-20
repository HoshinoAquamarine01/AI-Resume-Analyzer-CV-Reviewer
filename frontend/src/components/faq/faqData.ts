export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: "ats" | "files" | "security" | "pricing" | "ai";
  categoryName: string;
  tags: string[];
  popular?: boolean;
}

export interface FaqCategory {
  id: "all" | "ats" | "files" | "security" | "pricing" | "ai";
  label: string;
  iconName: string;
  count: number;
}

export const FAQ_DATA: FaqItem[] = [
  {
    id: "ats-calculation",
    question: "How is the ATS Score calculated by CVPulse?",
    answer:
      "CVPulse uses advanced AI models combined with parsing algorithms modeled after top Applicant Tracking Systems (such as Greenhouse, Lever, and Workday). Your CV is evaluated against the Job Description (JD) across 4 core pillars: 1) Hard skills keyword frequency & context; 2) Job Title relevance; 3) Clean, machine-readable CV structure & layout; 4) Quantified achievements (numbers & metrics in bullet points).",
    category: "ats",
    categoryName: "ATS System",
    tags: ["ATS Score", "Algorithms", "JD Matching"],
    popular: true,
  },
  {
    id: "ats-pass-score",
    question: "What ATS score is needed to pass automated resume screeners?",
    answer:
      "An ATS score of 75/100 or higher is considered safe, giving your resume up to 3x higher recruiter opening rates. A score of 85+ places you in the Top Applicant bracket. CVPulse highlights missing keywords so you can easily optimize your score to 80+.",
    category: "ats",
    categoryName: "ATS System",
    tags: ["Safe Score", "Pass Rate"],
    popular: true,
  },
  {
    id: "file-formats-supported",
    question: "Which file formats does CVPulse support?",
    answer:
      "We fully support PDF (.pdf) and Microsoft Word (.docx) files. We recommend exporting direct PDFs from Word or Google Docs to preserve clean text layers. Avoid scanned image-only PDFs, as traditional ATS systems cannot read text embedded in images.",
    category: "files",
    categoryName: "Formats & Files",
    tags: ["PDF", "DOCX", "Upload CV"],
    popular: true,
  },
  {
    id: "file-parsing-error",
    question: "Why failed to extract text or seeing garbled characters in my PDF?",
    answer:
      "This occurs if your PDF was generated as an image-only file from graphic tools (like Photoshop or Canva flattening text into images), or if the file is password-protected. Ensure your PDF is text-selectable so our AI engine can accurately parse 100% of your data.",
    category: "files",
    categoryName: "Formats & Files",
    tags: ["Parsing Error", "Canva", "Scanned PDF"],
  },
  {
    id: "data-privacy-security",
    question: "Is my CV and personal data kept secure and private?",
    answer:
      "Absolute data privacy is our top priority. All CV uploads and data transfers are protected using 256-bit SSL encryption. We NEVER share, sell, or monetize your personal data or CV contents with third parties or recruiters. You can permanently delete your CVs at any time.",
    category: "security",
    categoryName: "Security & Data",
    tags: ["Privacy", "SSL Encryption", "Delete Data"],
    popular: true,
  },
  {
    id: "ai-data-training",
    question: "Is my CV data used to train public AI models?",
    answer:
      "No. CVPulse connects via Enterprise Privacy APIs provided by OpenAI and Google Gemini. Under these enterprise agreements, API payload data is strictly isolated and NEVER used to train public foundation models.",
    category: "security",
    categoryName: "Security & Data",
    tags: ["Privacy API", "OpenAI Privacy"],
  },
  {
    id: "pricing-free-vs-pro",
    question: "What is the difference between the Free and Pro plans?",
    answer:
      "The Free plan allows basic CV analysis, general ATS scoring, and high-level fix suggestions. The Pro plan unlocks: 1) Unlimited deep JD keyword matching; 2) Tailored AI Cover Letter generation; 3) Predictive interview question generator matched to your CV & JD; 4) Full PDF analysis report export.",
    category: "pricing",
    categoryName: "Pro & Billing",
    tags: ["Free Plan", "Pro Upgrade", "VIP Features"],
    popular: true,
  },
  {
    id: "payment-methods",
    question: "Which payment methods are supported when upgrading to Pro?",
    answer:
      "We support instant, secure payments via QR Bank Transfer (VNPay / PayOS), Local ATM Cards, Visa/Mastercard credit cards, and Momo/ZaloPay e-wallets. Pro subscription features are activated automatically within 3-5 seconds after successful payment.",
    category: "pricing",
    categoryName: "Pro & Billing",
    tags: ["Payments", "VNPay", "Bank Transfer"],
  },
  {
    id: "cover-letter-ai",
    question: "How does the AI Cover Letter generator work?",
    answer:
      "Our AI Cover Letter tool cross-references the specific experiences in your CV against the key requirements in the Job Description. It crafts a unique, tailored application letter highlighting your competitive edge rather than using generic templates.",
    category: "ai",
    categoryName: "AI Features",
    tags: ["Cover Letter", "AI Writer"],
  },
  {
    id: "interview-predictor-ai",
    question: "How accurate is the AI Interview Question Predictor?",
    answer:
      "The AI simulates a Hiring Manager reviewing your application. It categorizes probable interview questions into: 1) Mandatory domain technical questions; 2) Behavioral situation questions; 3) Potential gaps or weak spots in your CV that interviewers will probe.",
    category: "ai",
    categoryName: "AI Features",
    tags: ["AI Interview", "Mock Interview"],
  }
];
