import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { InterviewService } from "./interview.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { UserDec } from "../../common/decorators/user.decorator";
import { formatResponse } from "../../utils/formatResponse";

@Controller("interview")
@UseGuards(JwtAuthGuard)
export class InterviewController {
  constructor(private readonly interviewService: InterviewService) {}

  @Post("start")
  async startInterviewSession(
    @UserDec() user: any,
    @Body("resumeId") resumeId: string,
    @Body("jobTitle") jobTitle: string,
    @Body("companyName") companyName: string,
    @Body("sessionType") sessionType: "technical" | "hr"
  ) {
    const session = await this.interviewService.create(
      user._id,
      resumeId,
      jobTitle,
      companyName,
      sessionType
    );
    return formatResponse(session, "Interview session created");
  }

  @Get()
  async getInterviewSessions(
    @UserDec() user: any,
    @Query("page") page = 1,
    @Query("limit") limit = 10
  ) {
    const result = await this.interviewService.findAll(user._id, Number(page), Number(limit));
    return formatResponse(result, "Sessions retrieved");
  }

  @Get("stats")
  async getSessionStatistics(@UserDec() user: any) {
    const stats = await this.interviewService.getStatistics(user._id);
    return formatResponse(stats, "Session statistics retrieved");
  }

  @Get(":sessionId")
  async getInterviewSessionById(@Param("sessionId") sessionId: string) {
    const session = await this.interviewService.findOne(sessionId);
    return formatResponse(session, "Session retrieved");
  }

  @Post(":sessionId/submit")
  @HttpCode(HttpStatus.OK)
  async submitInterviewAnswer(
    @Param("sessionId") sessionId: string,
    @Body("answer") answer: string
  ) {
    const session = await this.interviewService.addAnswer(sessionId, answer);
    return formatResponse(session, "Answer added to session");
  }

  @Post(":sessionId/end")
  @HttpCode(HttpStatus.OK)
  async endInterviewSession(@Param("sessionId") sessionId: string) {
    const session = await this.interviewService.findOne(sessionId);
    return formatResponse(session, "Interview session ended");
  }

  @Get(":sessionId/feedback")
  async getInterviewFeedback(@Param("sessionId") sessionId: string) {
    const session = await this.interviewService.findOne(sessionId);
    return formatResponse(session.feedback || [], "Feedback retrieved");
  }

  @Delete(":sessionId")
  async deleteSession(@UserDec() user: any, @Param("sessionId") sessionId: string) {
    const result = await this.interviewService.delete(user._id, sessionId);
    return formatResponse(null, result.message);
  }

  @Post(":sessionId/question")
  async addQuestion(
    @Param("sessionId") sessionId: string,
    @Body("question") question: string
  ) {
    const session = await this.interviewService.addQuestion(sessionId, question);
    return formatResponse(session, "Question added to session");
  }

  @Post(":sessionId/feedback")
  async addFeedback(
    @Param("sessionId") sessionId: string,
    @Body("feedback") feedback: string,
    @Body("score") score: number
  ) {
    const session = await this.interviewService.addFeedback(sessionId, feedback, score);
    return formatResponse(session, "Feedback added to session");
  }
}
