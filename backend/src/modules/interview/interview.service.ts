import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { InterviewSession, InterviewSessionDocument } from "../../models/InterviewSession";
import { AiService } from "../ai/ai.service";

import { ActivityLogService } from "../activity-log/activity-log.service";

@Injectable()
export class InterviewService {
  constructor(
    @InjectModel(InterviewSession.name)
    private readonly sessionModel: Model<InterviewSessionDocument>,
    private readonly aiService: AiService,
    private readonly activityLogService: ActivityLogService
  ) {}

  async create(userId: string, resumeId: string, jobTitle: string, companyName: string, sessionType: "technical" | "hr") {
    let generatedQuestions: string[] = [];
    let generalTips: string[] = [];

    if (resumeId) {
      try {
        const result: any = await this.aiService.generateInterviewQuestions(
          resumeId,
          `Target Position: ${jobTitle} at ${companyName}. Session Type: ${sessionType}`
        );

        let questionArray: any[] = [];
        if (typeof result === "object" && result !== null) {
          if (Array.isArray(result.questions)) {
            questionArray = result.questions;
          } else if (Array.isArray(result)) {
            questionArray = result;
          }

          if (Array.isArray(result.generalTips)) {
            generalTips = result.generalTips;
          }
        } else if (Array.isArray(result)) {
          questionArray = result;
        }

        if (questionArray.length > 0) {
          generatedQuestions = questionArray.map((q: string | { question: string }) => {
            if (typeof q === "string") return q;
            return q?.question || JSON.stringify(q);
          });
        }
      } catch (err) {
        console.error("[InterviewService] AI generation failed, using fallback questions:", err);
      }
    }

    if (generatedQuestions.length === 0) {
      generatedQuestions = [
        `Can you describe your experience relevant to the ${jobTitle} role?`,
        `How do you handle technical challenges and project deadlines?`,
        `What key achievements demonstrate your fit for ${companyName}?`,
      ];
    }

    const session = await this.sessionModel.create({
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
      generalTips,
    });

    await this.activityLogService.createLog(userId, "PRACTICE_INTERVIEW", {
      sessionId: session._id,
      jobTitle,
      companyName,
      sessionType,
    });

    return session;
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
    return this.submitAnswers(sessionId, answer);
  }

  async submitAnswers(sessionId: string, answersInput: string | string[]) {
    const session = await this.findOne(sessionId);
    const answersList = Array.isArray(answersInput) ? answersInput : [answersInput];
    session.answers = answersList;

    if (answersList.length > 0) {
      const avgLength =
        answersList.reduce((acc, a) => acc + (a?.trim().length || 0), 0) / answersList.length;
      const calculatedScore = Math.min(96, Math.max(70, Math.round(60 + avgLength * 0.12)));
      session.score = session.score && session.score > 0 ? session.score : calculatedScore;

      session.strengths = [
        "Structured responses addressing the core competencies of the position",
        "Demonstrated technical context, logic, and problem-solving readiness",
        "Clear alignment with key responsibilities expected for this role",
      ];

      session.weaknesses = [
        "Incorporate more measurable KPIs and quantifiable results (e.g. % improvement, team impact)",
        "Structure complex scenarios using the STAR framework (Situation, Task, Action, Result)",
      ];

      session.feedback = [
        `Good effort on the ${session.jobTitle || "target"} role practice session. Focus on being concise while emphasizing practical results.`,
      ];
    }

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
