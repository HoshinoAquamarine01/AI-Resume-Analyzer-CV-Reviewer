import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { InterviewSession, InterviewSessionDocument } from "../../models/InterviewSession";
import { AiService } from "../ai/ai.service";

@Injectable()
export class InterviewService {
  constructor(
    @InjectModel(InterviewSession.name)
    private readonly sessionModel: Model<InterviewSessionDocument>,
    private readonly aiService: AiService
  ) {}

  async create(userId: string, resumeId: string, jobTitle: string, companyName: string, sessionType: "technical" | "hr") {
    let generatedQuestions: string[] = [];

    if (resumeId) {
      try {
        const result = await this.aiService.generateInterviewQuestions(
          resumeId,
          `Target Position: ${jobTitle} at ${companyName}. Session Type: ${sessionType}`
        );
        if (Array.isArray(result)) {
          generatedQuestions = result.map((q: any) => (typeof q === "string" ? q : q.question || JSON.stringify(q)));
        }
      } catch (err) {
        generatedQuestions = [
          `Can you describe your experience relevant to the ${jobTitle} role?`,
          `How do you handle technical challenges and project deadlines?`,
        ];
      }
    }

    return this.sessionModel.create({
      userId: new Types.ObjectId(userId),
      resumeId: new Types.ObjectId(resumeId),
      jobTitle,
      companyName,
      sessionType,
      score: 0,
      questions: generatedQuestions,
      answers: [],
      feedback: [],
      strengths: [],
      weaknesses: [],
    });
  }

  async findAll(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const sessions = await this.sessionModel
      .find({ userId: new Types.ObjectId(userId) })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await this.sessionModel.countDocuments({ userId: new Types.ObjectId(userId) });
    return { sessions, total, pages: Math.ceil(total / limit) };
  }

  async findOne(sessionId: string) {
    const session = await this.sessionModel.findById(sessionId);
    if (!session) {
      throw new NotFoundException("Session not found");
    }
    return session;
  }

  async addQuestion(sessionId: string, question: string) {
    const session = await this.findOne(sessionId);
    session.questions = session.questions || [];
    session.questions.push(question);
    return session.save();
  }

  async addAnswer(sessionId: string, answer: string) {
    const session = await this.findOne(sessionId);
    session.answers = session.answers || [];
    session.answers.push(answer);
    return session.save();
  }

  async addFeedback(sessionId: string, feedback: string, score: number) {
    const session = await this.findOne(sessionId);
    session.feedback = session.feedback || [];
    session.feedback.push(feedback);
    session.score = score;
    return session.save();
  }

  async delete(userId: string, sessionId: string) {
    const session = await this.findOne(sessionId);
    if (session.userId.toString() !== userId) {
      throw new ForbiddenException("Unauthorized to delete this session");
    }
    await this.sessionModel.findByIdAndDelete(sessionId);
    return { message: "Session deleted" };
  }

  async getStatistics(userId: string) {
    const sessions = await this.sessionModel.find({ userId: new Types.ObjectId(userId) });

    const totalSessions = sessions.length;
    const completedSessions = sessions.length;
    const totalScore = sessions.reduce((acc, s) => acc + (s.score || 0), 0);
    const averageScore = totalSessions > 0 ? totalScore / totalSessions : 0;

    const technicalCount = sessions.filter((s) => s.sessionType === "technical").length;
    const hrCount = sessions.filter((s) => s.sessionType === "hr").length;

    return {
      totalSessions,
      completedSessions,
      averageScore,
      byType: {
        technical: technicalCount,
        hr: hrCount,
      },
    };
  }
}
