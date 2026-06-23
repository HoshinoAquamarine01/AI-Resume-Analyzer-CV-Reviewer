import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CoverLetter, CoverLetterDocument } from "../../models/CoverLetter";

@Injectable()
export class CoverLetterService {
  constructor(
    @InjectModel(CoverLetter.name) private readonly coverLetterModel: Model<CoverLetterDocument>
  ) {}

  async generate(userId: string, resumeId: string, jobTitle: string, companyName: string, jobDescription: string) {
    // Simulated cover letter content generation
    const content = `Dear Hiring Team,\n\nI am writing to express my strong interest in the ${jobTitle} position at ${companyName}.\n\nBased on my resume, I have the required skills and experience described in: "${jobDescription}".\n\nSincerely,\nCandidate`;
    
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

    // Simple improvement mock
    const improvedContent = `${coverLetter.content}\n\n[Improved Section - ${section}]: Emphasized key strengths and alignment with role requirements.`;

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

  async generatePdf(content: string): Promise<Buffer> {
    return Buffer.from(content || "");
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
