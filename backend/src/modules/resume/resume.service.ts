import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import * as path from "path";
import * as fs from "fs";
import * as mammoth from "mammoth";
import axios from "axios";

import { Resume, ResumeDocument } from "../../models/Resume";
import { ResumeAnalysis, ResumeAnalysisDocument } from "../../models/ResumeAnalysis";
import { DocumentGeneratorHelper, DocumentData, DocumentSection } from "../../common/helpers/document-generator.helper";
import { ActivityLogService } from "../activity-log/activity-log.service";

@Injectable()
export class ResumeService {
  constructor(
    @InjectModel(Resume.name) private resumeModel: Model<ResumeDocument>,
    @InjectModel(ResumeAnalysis.name) private analysisModel: Model<ResumeAnalysisDocument>,
    private readonly activityLogService: ActivityLogService
  ) {}

 
  async extractTextFromFile(fileUrlOrPath: string, fileType?: "pdf" | "docx"): Promise<string> {
    if (!fileUrlOrPath) return "";

    let dataBuffer: Buffer | null = null;
    let type = fileType || "pdf";

    try {
      if (fileUrlOrPath.startsWith("http://") || fileUrlOrPath.startsWith("https://")) {
     
        const response = await axios.get(fileUrlOrPath, { responseType: "arraybuffer" });
        dataBuffer = Buffer.from(response.data);
        if (fileUrlOrPath.toLowerCase().includes(".docx")) {
          type = "docx";
        }
      } else {
      
        let filePath = fileUrlOrPath;
        if (!path.isAbsolute(filePath)) {
          const cleanPath = fileUrlOrPath.startsWith("/") ? fileUrlOrPath.substring(1) : fileUrlOrPath;
          filePath = path.join(process.cwd(), cleanPath);
        }

        if (fs.existsSync(filePath)) {
          dataBuffer = fs.readFileSync(filePath);
          if (filePath.toLowerCase().endsWith(".docx") || filePath.toLowerCase().endsWith(".doc")) {
            type = "docx";
          }
        } else {
          console.warn(`[ResumeService] Local file not found at path: ${filePath}`);
        }
      }

      if (!dataBuffer || dataBuffer.length === 0) {
        return "";
      }

      if (type === "pdf") {
        let extracted = "";
        const pdfModule = require("pdf-parse");

        if (typeof pdfModule === "function") {
          const pdfData = await pdfModule(dataBuffer);
          extracted = pdfData?.text || "";
        } else if (pdfModule?.PDFParse) {
          const parser = new pdfModule.PDFParse({ data: dataBuffer });
          const parsed = await parser.getText();
          extracted = typeof parsed === "string" ? parsed : (parsed?.text || "");
          if (typeof parser.destroy === "function") {
            try {
              await parser.destroy();
            } catch (_) {}
          }
        }

       
        extracted = extracted.replace(/--\s*\d+\s*of\s*\d+\s*--/gi, "");
        return extracted.replace(/\r\n/g, "\n").replace(/\n\s*\n/g, "\n\n").trim();
      } else if (type === "docx" || type === "doc") {
        const result = await mammoth.extractRawText({ buffer: dataBuffer });
        const extracted = result?.value || "";
        return extracted.replace(/\r\n/g, "\n").replace(/\n\s*\n/g, "\n\n").trim();
      }
    } catch (error) {
      console.error(`[ResumeService] Error extracting text from ${fileUrlOrPath}:`, error);
    }

    return "";
  }

  async create(
    userId: string,
    title: string,
    fileUrl: string,
    fileType: "pdf" | "docx",
    extractedText?: string
  ) {
    let cleanText = extractedText ? extractedText.replace(/\n\s*\n/g, "\n").trim() : "";

    
    if (!cleanText && fileUrl) {
      cleanText = await this.extractTextFromFile(fileUrl, fileType);
    }

 
    if (!cleanText) {
      cleanText = "Sample extracted text from resume.";
    }

    const created = await this.resumeModel.create({
      userId: new Types.ObjectId(userId),
      title,
      fileUrl,
      fileType,
      extractedText: cleanText,
    });

    await this.activityLogService.createLog(userId, "UPLOAD_CV", {
      resumeId: created._id,
      title: created.title,
      fileUrl: created.fileUrl,
      fileType: created.fileType,
    });

    return created;
  }

  async findAll(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const resumes = await this.resumeModel
      .find({ userId: new Types.ObjectId(userId) })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await this.resumeModel.countDocuments({ userId: new Types.ObjectId(userId) });
    return { resumes, total, pages: Math.ceil(total / limit) };
  }

  async findOne(resumeId: string) {
    const resume = await this.resumeModel.findById(resumeId);
    if (!resume) {
      throw new NotFoundException("Resume not found");
    }
    return resume;
  }

  async update(userId: string, resumeId: string, title: string, fileUrl?: string, fileType?: "pdf" | "docx") {
    const resume = await this.findOne(resumeId);
    if (resume.userId.toString() !== userId) {
      throw new ForbiddenException("Unauthorized to update this resume");
    }

    const updateData: any = { title, updatedAt: new Date() };
    if (fileUrl) updateData.fileUrl = fileUrl;
    if (fileType) updateData.fileType = fileType;


    if (fileUrl && fileUrl !== resume.fileUrl) {
      const newExtractedText = await this.extractTextFromFile(fileUrl, fileType || resume.fileType);
      if (newExtractedText) {
        updateData.extractedText = newExtractedText;
      }
    }

    const updated = await this.resumeModel.findByIdAndUpdate(resumeId, updateData, { new: true });
    return updated;
  }

  async delete(userId: string, resumeId: string) {
    const resume = await this.findOne(resumeId);
    if (resume.userId.toString() !== userId) {
      throw new ForbiddenException("Unauthorized to delete this resume");
    }
    await this.resumeModel.findByIdAndDelete(resumeId);
    return { message: "Resume deleted" };
  }

  async duplicate(userId: string, resumeId: string) {
    const original = await this.findOne(resumeId);
    return this.resumeModel.create({
      userId: new Types.ObjectId(userId),
      title: `${original.title} (Copy)`,
      fileUrl: original.fileUrl,
      fileType: original.fileType,
      extractedText: original.extractedText,
    });
  }

  async share(userId: string, resumeId: string) {
    const resume = await this.findOne(resumeId);
    if (resume.userId.toString() !== userId) {
      throw new ForbiddenException("Unauthorized to share this resume");
    }
    return resume;
  }

  private buildResumeDocumentData(input: any, defaultTitle = 'Resume'): DocumentData {
    if (typeof input === 'string') {
      return DocumentGeneratorHelper.parseTextToDocumentData(input, defaultTitle);
    }

    if (input && typeof input === 'object') {
      const title = input.title || defaultTitle;
      const sections: DocumentSection[] = [];

      if (input.skills && Array.isArray(input.skills) && input.skills.length > 0) {
        sections.push({
          title: 'Skills & Competencies',
          bullets: input.skills,
        });
      }

      if (input.experience && Array.isArray(input.experience) && input.experience.length > 0) {
        sections.push({
          title: 'Work Experience',
          bullets: input.experience,
        });
      }

      if (input.education && Array.isArray(input.education) && input.education.length > 0) {
        sections.push({
          title: 'Education',
          bullets: input.education,
        });
      }

      if (input.projects && Array.isArray(input.projects) && input.projects.length > 0) {
        sections.push({
          title: 'Projects',
          bullets: input.projects,
        });
      }

      if (input.certifications && Array.isArray(input.certifications) && input.certifications.length > 0) {
        sections.push({
          title: 'Certifications',
          bullets: input.certifications,
        });
      }

      if (input.languages && Array.isArray(input.languages) && input.languages.length > 0) {
        sections.push({
          title: 'Languages',
          bullets: input.languages,
        });
      }

      if (sections.length === 0 && input.extractedText) {
        return DocumentGeneratorHelper.parseTextToDocumentData(input.extractedText, title);
      }

      return {
        title,
        sections: sections.length > 0 ? sections : [{ content: input.extractedText || 'No detailed content.' }],
        rawText: input.extractedText,
      };
    }

    return DocumentGeneratorHelper.parseTextToDocumentData('', defaultTitle);
  }

  async generatePdf(input?: any, title?: string): Promise<Buffer> {
    const docData = this.buildResumeDocumentData(input, title);
    return DocumentGeneratorHelper.generatePdfBuffer(docData);
  }

  async generatePDF(input?: any, title?: string): Promise<Buffer> {
    return this.generatePdf(input, title);
  }

  async generateDocx(input?: any, title?: string): Promise<Buffer> {
    const docData = this.buildResumeDocumentData(input, title);
    return DocumentGeneratorHelper.generateDocxBuffer(docData);
  }

  async getAvailableTemplates(category?: string, query?: string) {
    const templates = [
      {
        id: "tpl-tech-modern",
        title: "Silicon Tech Professional",
        category: "tech",
        categoryName: "Tech & Engineering",
        description: "Clean single-column layout optimized for Software Engineers, System Architects, and Product Leads with high keyword parser precision.",
        atsScore: 98,
        popular: true,
        recommendedFor: ["Software Engineer", "DevOps Engineer", "Frontend Developer", "Full Stack Developer"],
        tags: ["Single Column", "Tech Focus", "High ATS Parsing", "Clean Skills Grid"],
        colorScheme: { primary: "#2563eb", secondary: "#3b82f6", bg: "#0f172a" },
        sections: [
          { name: "Header", fields: ["Full Name", "Title", "GitHub", "LinkedIn", "Email", "Phone"] },
          { name: "Professional Summary", fields: ["3-4 line targeted impact statement"] },
          { name: "Technical Skills", fields: ["Languages", "Frameworks", "Cloud & DevOps", "Databases"] },
          { name: "Work Experience", fields: ["Company", "Role", "Dates", "Bullet Points with Metrics"] },
          { name: "Key Projects", fields: ["Project Name", "Tech Stack", "Outcome & Metrics"] },
          { name: "Education", fields: ["Degree", "University", "Graduation Year"] }
        ],
        sampleData: {
          name: "Alex Mercer",
          title: "Senior Full Stack Engineer",
          summary: "Results-driven Software Engineer with 6+ years of experience designing scalable microservices and real-time WebApps processing 1M+ daily API requests.",
          skills: ["TypeScript", "React / Next.js", "Node.js (NestJS)", "Docker / K8s", "AWS / Cloudflare", "PostgreSQL / Redis"],
          experience: [
            "Architected real-time analytics pipeline using NestJS & Redis Pub/Sub, cutting latency by 45%",
            "Spearheaded migration of legacy monolith to Dockerized microservices on AWS EKS",
            "Mentored junior engineers and instituted automated CI/CD pipelines reducing deployment friction"
          ]
        }
      },
      {
        id: "tpl-exec-suite",
        title: "Executive Leadership Suite",
        category: "executive",
        categoryName: "Executive & Leadership",
        description: "Authoritative design structured for Directors, VPs, and C-Level Executives highlighting revenue growth, team scaling, and strategy.",
        atsScore: 96,
        popular: true,
        recommendedFor: ["Engineering Director", "VP of Technology", "Chief Product Officer", "General Manager"],
        tags: ["Executive", "Leadership Metrics", "Strategic Impact", "Clean Spacing"],
        colorScheme: { primary: "#4f46e5", secondary: "#6366f1", bg: "#1e1b4b" },
        sections: [
          { name: "Header", fields: ["Full Name", "Executive Title", "Contact Info", "Portfolio Link"] },
          { name: "Executive Core Competencies", fields: ["Strategic Leadership", "P&L Management", "Team Scaling"] },
          { name: "Career Accomplishments", fields: ["High-level key wins & ROI highlights"] },
          { name: "Professional Experience", fields: ["Company", "Title", "Metrics & Organizational Growth"] },
          { name: "Education & Credentials", fields: ["MBA / MS Degrees", "Board Seats", "Certifications"] }
        ],
        sampleData: {
          name: "Eleanor Vance",
          title: "Vice President of Product & Engineering",
          summary: "Visionary Executive with 12+ years steering multi-disciplinary engineering departments, driving $50M+ annual recurring revenue growth.",
          skills: ["Organizational Leadership", "P&L Management ($30M+)", "Agile Transformation", "Strategic M&A", "Global Hiring"],
          experience: [
            "Grew engineering org from 25 to 140+ engineers across 4 international tech hubs",
            "Delivered 120% YoY ARR growth through strategic product line launches",
            "Managed $35M annual operating budget with zero budget overrun for 4 consecutive years"
          ]
        }
      },
      {
        id: "tpl-ats-minimal",
        title: "Ultra Clean ATS Baseline",
        category: "minimal",
        categoryName: "Minimal & ATS Clean",
        description: "100% fail-safe layout with strict standard headers, monochrome styling, and maximum compatibility with legacy Taleo & Workday scanners.",
        atsScore: 100,
        popular: true,
        recommendedFor: ["All Professions", "Finance", "Healthcare", "Government & Enterprise"],
        tags: ["100% Parsing Guarantee", "No Columns", "Standard Fonts", "Maximum Compatibility"],
        colorScheme: { primary: "#0f172a", secondary: "#334155", bg: "#f8fafc" },
        sections: [
          { name: "Header", fields: ["Full Name", "Phone", "Email", "Location", "LinkedIn"] },
          { name: "Summary", fields: ["Concise career overview"] },
          { name: "Experience", fields: ["Chronological history"] },
          { name: "Education", fields: ["Degrees & Honors"] },
          { name: "Skills", fields: ["Hard skills & Certifications"] }
        ],
        sampleData: {
          name: "David Sterling",
          title: "Senior Business Analyst",
          summary: "Detail-oriented Business Analyst specializing in process optimization, financial modeling, and cross-functional enterprise software delivery.",
          skills: ["SQL", "Tableau / Power BI", "Financial Modeling", "Requirements Gathering", "Jira & Confluence"],
          experience: [
            "Optimized supply chain workflow resulting in $1.8M annual cost reduction",
            "Authored 50+ detailed functional spec documents for enterprise ERP migration"
          ]
        }
      },
      {
        id: "tpl-creative-pro",
        title: "Creative Vanguard",
        category: "creative",
        categoryName: "Creative & Design",
        description: "Modern visual hierarchy tailored for UI/UX Designers, Product Designers, and Creative Directors featuring portfolio highlight blocks.",
        atsScore: 92,
        popular: false,
        recommendedFor: ["UI/UX Designer", "Product Designer", "Art Director", "Brand Strategist"],
        tags: ["Visual Accent", "Portfolio Highlights", "Clean Typography", "Design Systems"],
        colorScheme: { primary: "#06b6d4", secondary: "#0891b2", bg: "#083344" },
        sections: [
          { name: "Header", fields: ["Name", "Role", "Behance / Dribbble / Portfolio URL"] },
          { name: "Design Philosophy", fields: ["Short user-centric approach summary"] },
          { name: "Selected Projects", fields: ["Project Title", "Impact", "Dribbble Link"] },
          { name: "Design & Technical Skills", fields: ["Figma", "Design Systems", "Prototyping"] },
          { name: "Experience", fields: ["Roles & Product Achievements"] }
        ],
        sampleData: {
          name: "Maya Lin",
          title: "Lead UI/UX Product Designer",
          summary: "User-centric Product Designer crafting intuitive digital products used by over 5 million active global users across iOS, Android, and Web.",
          skills: ["Figma / Design Systems", "User Research & Usability Testing", "Interactive Prototyping", "Design Tokens", "HTML/CSS/Tailwind"],
          experience: [
            "Redesigned core mobile checkout flow, improving conversion by 28%",
            "Established enterprise design system adopted across 8 distinct product teams"
          ]
        }
      },
      {
        id: "tpl-marketing-growth",
        title: "Growth & Performance Marketing",
        category: "marketing",
        categoryName: "Marketing & Sales",
        description: "Metric-heavy layout built specifically for Growth Marketers, SEO Specialists, and Demand Generation Managers to show CAC/ROAS proof.",
        atsScore: 95,
        popular: false,
        recommendedFor: ["Growth Marketer", "SEO Manager", "Demand Gen Lead", "Account Executive"],
        tags: ["ROAS / Metric Focus", "Campaign Highlights", "Lead Gen Focus"],
        colorScheme: { primary: "#ec4899", secondary: "#f43f5e", bg: "#4c0519" },
        sections: [
          { name: "Header", fields: ["Name", "Title", "LinkedIn", "Email"] },
          { name: "Impact Metric Summary", fields: ["Highlighted total ad spend managed & revenue generated"] },
          { name: "Core Marketing Stack", fields: ["Google Ads", "Meta Ads", "HubSpot", "GA4"] },
          { name: "Experience", fields: ["Campaign results & conversion lift"] },
          { name: "Education", fields: ["Degree & Google / HubSpot Certifications"] }
        ],
        sampleData: {
          name: "Marcus Brody",
          title: "Head of Growth Marketing",
          summary: "Data-driven Growth Lead having scaled SaaS startup ARR from $1M to $12M through multi-channel performance advertising and funnel optimization.",
          skills: ["Paid Search & Social", "Google Analytics 4 / Amplitude", "A/B Experimentation", "HubSpot CRM", "Conversion Rate Optimization"],
          experience: [
            "Scaled monthly ad spend from $10k to $250k while reducing Customer Acquisition Cost (CAC) by 32%",
            "Built automated lifecycle email nurture series generating 40% of inbound sales pipeline"
          ]
        }
      },
      {
        id: "tpl-finance-capital",
        title: "Wall Street Financial Professional",
        category: "finance",
        categoryName: "Finance & Banking",
        description: "Traditional corporate formatting ideal for Investment Banking, Financial Analysts, Corporate Accounting, and Risk Management.",
        atsScore: 97,
        popular: false,
        recommendedFor: ["Financial Analyst", "Investment Banker", "Risk Manager", "Accountant"],
        tags: ["Corporate Format", "CFA / CPA Focus", "Dense Information", "Conservative"],
        colorScheme: { primary: "#1e3a8a", secondary: "#1d4ed8", bg: "#172554" },
        sections: [
          { name: "Header", fields: ["Name", "Professional Title", "CFA/CPA designation", "Email", "Phone"] },
          { name: "Education & Certifications", fields: ["Top university degrees, CFA Charterholder"] },
          { name: "Transaction & Deal History", fields: ["M&A deals, IPO underwriting, Portfolio sizes"] },
          { name: "Professional Experience", fields: ["Banking & Financial analysis roles"] },
          { name: "Technical Competencies", fields: ["Bloomberg Terminal", "Excel Financial Modeling", "SQL"] }
        ],
        sampleData: {
          name: "Samantha Wright, CFA",
          title: "Senior Investment Banking Associate",
          summary: "CFA Charterholder with 5+ years of M&A transaction advisory experience, executing over $4.2B in aggregate closed deal volume.",
          skills: ["Financial Modeling & Valuation (DCF, LBO)", "M&A Advisory", "Bloomberg / Capital IQ", "Corporate Credit Analysis", "SQL / Python"],
          experience: [
            "Led financial modeling for $1.5B cross-border tech acquisition",
            "Prepared confidential information memoranda (CIM) and pitchbooks for 15+ prospective transactions"
          ]
        }
      }
    ];

    let filtered = templates;

    if (category && category !== "all") {
      filtered = filtered.filter((t) => t.category === category.toLowerCase());
    }

    if (query && query.trim() !== "") {
      const q = query.toLowerCase().trim();
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.categoryName.toLowerCase().includes(q) ||
          t.recommendedFor.some((role) => role.toLowerCase().includes(q)) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    return filtered;
  }

  async search(userId: string, query: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const filter = {
      userId: new Types.ObjectId(userId),
      $or: [
        { title: { $regex: query, $options: "i" } },
        { extractedText: { $regex: query, $options: "i" } },
      ],
    };

    const resumes = await this.resumeModel.find(filter).skip(skip).limit(limit);
    const total = await this.resumeModel.countDocuments(filter);
    return { resumes, total, pages: Math.ceil(total / limit) };
  }

  async getAnalysis(userId: string, resumeId: string) {
    const resume = await this.findOne(resumeId);
    if (resume.userId.toString() !== userId) {
      throw new ForbiddenException("Unauthorized to view analysis");
    }

    const analysis = await this.analysisModel.findOne({
      resumeId: new Types.ObjectId(resumeId),
      userId: new Types.ObjectId(userId),
    });

    if (!analysis) {
      throw new NotFoundException("Analysis not found");
    }
    return analysis;
  }

  async createAnalysis(userId: string, resumeId: string, score: number) {
    const analysis = await this.analysisModel.create({
      resumeId: new Types.ObjectId(resumeId),
      userId: new Types.ObjectId(userId),
      overallScore: score,
      analyzedAt: new Date(),
    });

    await this.activityLogService.createLog(userId, "RUN_AI_ANALYSIS", {
      resumeId,
      overallScore: score,
    });

    return analysis;
  }
}
