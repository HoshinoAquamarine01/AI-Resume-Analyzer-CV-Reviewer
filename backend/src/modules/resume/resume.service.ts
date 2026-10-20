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
      },
      {
        id: "tpl-topcv-standard",
        title: "TopCV Standard Professional",
        category: "topcv",
        categoryName: "TopCV Series",
        description: "Mẫu CV chuẩn mực, bố cục 2 cột cân đối kinh điển từ TopCV với sắc xanh đặc trưng. Tối ưu ATS 99%, định dạng chuyên nghiệp cho mọi ngành nghề văn phòng và quản trị.",
        atsScore: 99,
        popular: true,
        recommendedFor: ["Nhân sự (HR)", "Hành chính văn phòng", "Kế toán / Kiểm toán", "Chuyên viên tư vấn", "Vận hành (Operations)"],
        tags: ["TopCV", "Tiêu chuẩn", "ATS 99%", "Bố cục cân đối", "Thanh lịch"],
        colorScheme: { primary: "#00b14f", secondary: "#10b981", bg: "#022c22" },
        sections: [
          { name: "Thông tin cá nhân", fields: ["Họ và tên", "Vị trí ứng tuyển", "Email", "Số điện thoại", "Địa chỉ", "LinkedIn"] },
          { name: "Mục tiêu nghề nghiệp", fields: ["Mục tiêu ngắn hạn", "Định hướng phát triển dài hạn gắn liền với doanh nghiệp"] },
          { name: "Kinh nghiệm làm việc", fields: ["Công ty", "Chức danh", "Thời gian", "Nhiệm vụ trọng tâm & Kết quả đạt được (KPIs)"] },
          { name: "Kỹ năng chuyên môn", fields: ["Kỹ năng nghiệp vụ", "Kỹ năng mềm", "Ngoại ngữ", "Tin học văn phòng"] },
          { name: "Học vấn & Chứng chỉ", fields: ["Trường Đại học", "Chuyên ngành", "GPA / Xếp loại", "Chứng chỉ nghiệp vụ"] }
        ],
        sampleData: {
          name: "Nguyễn Thu Hà",
          title: "Chuyên Viên Nhân Sự Tổng Hợp (HR Generalist)",
          summary: "Chuyên viên Nhân sự với hơn 4 năm kinh nghiệm trong công tác tuyển dụng, đào tạo và quản trị quan hệ lao động (C&B). Nắm vững luật lao động và các công cụ ATS hiện đại.",
          skills: ["Tuyển dụng & Thu hút nhân tài", "C&B & Tiền lương", "Luật Lao động Việt Nam", "Đào tạo nội bộ", "Tiếng Anh TOEIC 850", "MS Excel nâng cao"],
          experience: [
            "Quản lý quy trình tuyển dụng thành công 120+ nhân sự đa cấp bậc trong năm 2023, rút ngắn thời gian tuyển dụng (Time-to-Hire) từ 30 ngày xuống 18 ngày",
            "Xây dựng và chuẩn hóa hệ thống khung năng lực đánh giá KPI định kỳ cho 300+ nhân sự toàn công ty",
            "Tối ưu chi phí tuyển dụng 22% nhờ xây dựng mạng lưới ứng viên chủ động trên LinkedIn và TopCV"
          ]
        }
      },
      {
        id: "tpl-topcv-modern",
        title: "TopCV Modern Dynamic",
        category: "topcv",
        categoryName: "TopCV Series",
        description: "Mẫu CV hiện đại phong cách TopCV với điểm nhấn trực quan, tối ưu cho Marketing, Sales, Media và Sáng tạo. Bố cục ấn tượng làm nổi bật các chỉ số ROI, KPIs và chiến dịch.",
        atsScore: 97,
        popular: true,
        recommendedFor: ["Digital Marketing", "Content Creator", "Brand Executive", "Sales Manager", "PR & Event"],
        tags: ["TopCV", "Hiện đại", "Marketing & Sales", "Nổi bật KPI", "Trực quan"],
        colorScheme: { primary: "#0ea5e9", secondary: "#38bdf8", bg: "#082f49" },
        sections: [
          { name: "Thông tin cá nhân & Portfolio", fields: ["Họ tên", "Chức danh", "Hotline", "Email", "Portfolio Link / Behance"] },
          { name: "Tóm tắt thế mạnh", fields: ["Thế mạnh tư duy chiến lược", "Hiệu quả chiến dịch Marketing & Doanh số"] },
          { name: "Kinh nghiệm & Chiến dịch tiêu biểu", fields: ["Công ty", "Vị trí", "Quy mô ngân sách", "Chỉ số tăng trưởng (ROAS, GMV, Reach)"] },
          { name: "Dự án nổi bật", fields: ["Tên chiến dịch", "Vai trò", "Ngân sách & Kết quả chuyển đổi"] },
          { name: "Bộ công cụ chuyên môn", fields: ["Meta Ads", "Google Ads", "TikTok Ads", "GA4", "SEO Tools", "Canva / Figma"] }
        ],
        sampleData: {
          name: "Trần Minh Quang",
          title: "Digital Marketing Team Lead",
          summary: "Marketing Lead với 5 năm kinh nghiệm dẫn dắt các chiến dịch Performance & Brand đa kênh. Chuyên sâu về tối ưu ROI, quản lý ngân sách quảng cáo hơn 2 tỷ VNĐ/tháng.",
          skills: ["Meta & Google Performance Ads", "Tối ưu hóa phễu chuyển đổi (CRO)", "Google Analytics 4 & BigQuery", "Chiến lược Content & Viral Campaign", "Quản lý ngân sách & ROI"],
          experience: [
            "Dẫn dắt đội ngũ 6 thành viên triển khai chiến dịch ra mắt sản phẩm mới đạt 45.000 đơn hàng trong quý 4, ROAS trung bình 4.8x",
            "Tái cấu trúc hệ thống quảng cáo paid-traffic giúp giảm 35% chi phí trên mỗi lượt chuyển đổi (CPA) cho thương hiệu",
            "Mở rộng kênh TikTok Shop đạt doanh thu 800 triệu VNĐ/tháng sau 3 tháng vận hành từ con số 0"
          ]
        }
      },
      {
        id: "tpl-topcv-it-pro",
        title: "TopCV Tech Developer",
        category: "topcv",
        categoryName: "TopCV Series",
        description: "Mẫu CV chuẩn công nghệ thông tin theo phong cách TopCV Tech. Cấu trúc chuyên biệt cho Tech Stack, hệ thống Microservices, Repositories GitHub và dự án thực tế.",
        atsScore: 99,
        popular: true,
        recommendedFor: ["Software Engineer", "Frontend Developer", "Backend Developer", "DevOps Engineer", "QA / QC"],
        tags: ["TopCV", "IT / Lập trình", "Chuẩn ATS 99%", "Tech Stack", "GitHub Projects"],
        colorScheme: { primary: "#6366f1", secondary: "#818cf8", bg: "#1e1b4b" },
        sections: [
          { name: "Thông tin liên hệ & Repositories", fields: ["Họ tên", "Tech Lead / Developer", "GitHub", "LinkedIn", "Portfolio"] },
          { name: "Tổng quan kỹ thuật", fields: ["Số năm kinh nghiệm", "Thế mạnh công nghệ lõi", "Kiến trúc hệ thống"] },
          { name: "Kỹ năng công nghệ (Tech Stack)", fields: ["Languages", "Frameworks & Libs", "Databases", "DevOps & Cloud", "Tools"] },
          { name: "Kinh nghiệm phát triển phần mềm", fields: ["Công ty", "Vị trí", "Tech stack sử dụng", "Trách nhiệm & Tối ưu hiệu năng"] },
          { name: "Dự án thực tế (Projects)", fields: ["Tên dự án", "Quy mô người dùng (DAU)", "Giải pháp kỹ thuật", "Link Demo/Source"] }
        ],
        sampleData: {
          name: "Lê Hoàng Nam",
          title: "Senior Full-Stack Developer",
          summary: "Kỹ sư phần mềm 5 năm kinh nghiệm phát triển các hệ thống Web và Microservices chịu tải cao. Đam mê tối ưu hóa kiến trúc sạch (Clean Architecture) và CI/CD.",
          skills: ["TypeScript / JavaScript", "NestJS / Express / Node.js", "React.js / Next.js / TailwindCSS", "PostgreSQL, MongoDB, Redis", "Docker, Kubernetes, AWS (EC2, S3)", "Microservices Architecture & Kafka"],
          experience: [
            "Thiết kế và triển khai hệ thống thanh toán tự động xử lý hơn 50.000 giao dịch/ngày với độ trễ phản hồi < 120ms",
            "Chuyển đổi hệ thống nguyên khối (Monolith) sang Microservices, giúp cải thiện 40% hiệu suất tải trang và giảm 60% downtime khi triển khai",
            "Xây dựng và chuẩn hóa quy trình CI/CD với GitHub Actions, tự động hóa kiểm thử đơn vị đạt 85% code coverage"
          ]
        }
      },
      {
        id: "tpl-topcv-fresher",
        title: "TopCV Fresher Starter",
        category: "topcv",
        categoryName: "TopCV Series",
        description: "Mẫu CV thiết kế chuyên biệt cho Sinh viên mới ra trường và Thực tập sinh từ TopCV. Tập trung làm nổi bật điểm số GPA, đồ án tốt nghiệp, hoạt động CLB và tinh thần học hỏi.",
        atsScore: 98,
        popular: true,
        recommendedFor: ["Sinh viên mới tốt nghiệp", "Thực tập sinh (Intern)", "Junior Developer", "Cộng tác viên", "Fresher"],
        tags: ["TopCV", "Fresher / Intern", "Sinh viên", "Đồ án tốt nghiệp", "Năng động"],
        colorScheme: { primary: "#f59e0b", secondary: "#fbbf24", bg: "#451a03" },
        sections: [
          { name: "Thông tin cá nhân", fields: ["Họ tên", "Vị trí thực tập / Fresher", "Email", "Số điện thoại", "Trường Đại học"] },
          { name: "Mục tiêu thực tập & Nghề nghiệp", fields: ["Mong muốn học hỏi", "Mục tiêu trở thành nhân viên chính thức trong 6 tháng"] },
          { name: "Học vấn & Thành tích", fields: ["Trường Đại học", "Ngành học", "GPA 3.4/4.0", "Học bổng / Giải thưởng sinh viên"] },
          { name: "Đồ án tốt nghiệp & Dự án cá nhân", fields: ["Tên đồ án", "Công nghệ / Phương pháp", "Điểm số đạt được", "Vai trò thực hiện"] },
          { name: "Hoạt động ngoại khóa & Kỹ năng", fields: ["CLB sinh viên", "Tình nguyện viên", "Kỹ năng làm việc nhóm", "Kỹ năng giao tiếp"] }
        ],
        sampleData: {
          name: "Phạm Phương Thảo",
          title: "Fresher Business Analyst / Junior Intern",
          summary: "Tốt nghiệp loại Giỏi chuyên ngành Hệ thống Thông tin Quản lý (MIS). Tích cực, có khả năng nắm bắt nhanh nghiệp vụ, thành thạo phân tích yêu cầu (BRD/SRS) và trực quan hóa dữ liệu với Power BI.",
          skills: ["Phân tích nghiệp vụ (BRD/SRS)", "Vẽ sơ đồ UML & BPMN", "SQL cơ bản & Data Querying", "Power BI / Excel", "Tiếng Anh IELTS 7.0", "Thuyết trình & Làm việc nhóm"],
          experience: [
            "Đồ án tốt nghiệp 'Hệ thống Quản lý Bán lẻ đa kênh Omnichannel' - Đạt điểm A (9.2/10), phụ trách khảo sát nghiệp vụ và thiết kế User Flow",
            "Thực tập sinh Phân tích Dữ liệu tại Công ty FinTech: Hỗ trợ xây dựng 8 Dashboard theo dõi chỉ số người dùng định kỳ trên Power BI",
            "Phó chủ nhiệm CLB Kỹ năng Doanh nhân Trẻ: Điều phối thành công chuỗi sự kiện hướng nghiệp thu hút hơn 800 sinh viên tham gia"
          ]
        }
      }
    ];

    let filtered = templates;

    if (category && category !== "all") {
      const cat = category.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.category === cat ||
          (cat === "topcv" && (t.category === "topcv" || t.tags.some((tag) => tag.toLowerCase().includes("topcv")))) ||
          (cat === "tech" && (t.category === "tech" || t.id.includes("it-pro"))) ||
          (cat === "marketing" && (t.category === "marketing" || t.id.includes("modern"))) ||
          (cat === "minimal" && (t.category === "minimal" || t.id.includes("standard") || t.id.includes("fresher")))
      );
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
    }).sort({ analyzedAt: -1 });

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
