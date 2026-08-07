import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CoverLetter, CoverLetterDocument } from "../../models/CoverLetter";
import { AiService } from "../ai/ai.service";
import { DocumentGeneratorHelper, DocumentData } from "../../common/helpers/document-generator.helper";

@Injectable()
export class CoverLetterService {
  constructor(
    @InjectModel(CoverLetter.name) private readonly coverLetterModel: Model<CoverLetterDocument>,
    private readonly aiService: AiService
  ) {}

  async generate(userId: string, resumeId: string, jobTitle: string, companyName: string, jobDescription: string) {
    let content = "";
    try {
      const aiRes = await this.aiService.generateCoverLetter(resumeId, jobTitle, companyName, jobDescription);
      content = aiRes.coverLetter || "";
    } catch (err) {
      content = `Dear Hiring Team at ${companyName},\n\nI am writing to express my strong interest in the ${jobTitle} position.\n\nSincerely,\nApplicant`;
    }

    return this.coverLetterModel.create({
      userId: new Types.ObjectId(userId),
      resumeId: new Types.ObjectId(resumeId),
      jobTitle,
      companyName,
      content,
      tone: "professional",
      generatedByAI: true,
    });
  }

  async findAll(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const coverLetters = await this.coverLetterModel
      .find({ userId: new Types.ObjectId(userId) })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await this.coverLetterModel.countDocuments({ userId: new Types.ObjectId(userId) });
    return { coverLetters, total, pages: Math.ceil(total / limit) };
  }

  async findOne(coverLetterId: string) {
    const coverLetter = await this.coverLetterModel.findById(coverLetterId);
    if (!coverLetter) {
      throw new NotFoundException("Cover letter not found");
    }
    return coverLetter;
  }

  async update(userId: string, coverLetterId: string, content: string, jobTitle: string, companyName: string) {
    const coverLetter = await this.findOne(coverLetterId);
    if (coverLetter.userId.toString() !== userId) {
      throw new ForbiddenException("Unauthorized to update this cover letter");
    }

    return this.coverLetterModel.findByIdAndUpdate(
      coverLetterId,
      { content, jobTitle, companyName, updatedAt: new Date() },
      { new: true }
    );
  }

  async delete(userId: string, coverLetterId: string) {
    const coverLetter = await this.findOne(coverLetterId);
    if (coverLetter.userId.toString() !== userId) {
      throw new ForbiddenException("Unauthorized to delete this cover letter");
    }
    await this.coverLetterModel.findByIdAndDelete(coverLetterId);
    return { message: "Cover letter deleted" };
  }

  async improveSection(userId: string, coverLetterId: string, section: string) {
    const coverLetter = await this.findOne(coverLetterId);
    if (coverLetter.userId.toString() !== userId) {
      throw new ForbiddenException("Unauthorized to modify this cover letter");
    }

    let improvedContent = coverLetter.content;
    try {
      const aiRes = await this.aiService.improveResume(
        coverLetter.resumeId.toString(),
        `Cover Letter Section: ${section}\nCurrent Content: ${coverLetter.content}`
      );
      improvedContent = aiRes.improvedContent || aiRes.extractedText || coverLetter.content;
    } catch (err) {
      improvedContent = `${coverLetter.content}\n\n[Improved ${section}]`;
    }

    return this.coverLetterModel.findByIdAndUpdate(
      coverLetterId,
      { content: improvedContent },
      { new: true }
    );
  }

  async duplicate(userId: string, coverLetterId: string) {
    const original = await this.findOne(coverLetterId);
    return this.coverLetterModel.create({
      userId: new Types.ObjectId(userId),
      resumeId: original.resumeId,
      jobTitle: original.jobTitle,
      companyName: original.companyName,
      content: original.content,
      tone: original.tone,
      generatedByAI: original.generatedByAI,
    });
  }

  private buildCoverLetterDocumentData(input: any, defaultTitle = 'Cover Letter'): DocumentData {
    if (typeof input === 'string') {
      return DocumentGeneratorHelper.parseTextToDocumentData(input, defaultTitle);
    }

    if (input && typeof input === 'object') {
      const jobTitle = input.jobTitle || '';
      const companyName = input.companyName || '';
      const title = jobTitle ? `Cover Letter - ${jobTitle}` : defaultTitle;
      const subtitle = companyName ? `Application for ${companyName}` : undefined;

      const parsed = DocumentGeneratorHelper.parseTextToDocumentData(input.content || '', title);
      parsed.subtitle = subtitle || parsed.subtitle;
      return parsed;
    }

    return DocumentGeneratorHelper.parseTextToDocumentData('', defaultTitle);
  }

  async generatePdf(input: any, title?: string): Promise<Buffer> {
    const docData = this.buildCoverLetterDocumentData(input, title);
    return DocumentGeneratorHelper.generatePdfBuffer(docData);
  }

  async generateDocx(input: any, title?: string): Promise<Buffer> {
    const docData = this.buildCoverLetterDocumentData(input, title);
    return DocumentGeneratorHelper.generateDocxBuffer(docData);
  }

  async search(userId: string, query: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const filter = {
      userId: new Types.ObjectId(userId),
      $or: [
        { jobTitle: { $regex: query, $options: "i" } },
        { companyName: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ],
    };

    const coverLetters = await this.coverLetterModel.find(filter).skip(skip).limit(limit);
    const total = await this.coverLetterModel.countDocuments(filter);
    return { coverLetters, total, pages: Math.ceil(total / limit) };
  }
}
