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

  async getAvailableTemplates() {
    return [
      { id: 1, name: "Modern" },
      { id: 2, name: "Classic" },
      { id: 3, name: "Creative" },
    ];
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
