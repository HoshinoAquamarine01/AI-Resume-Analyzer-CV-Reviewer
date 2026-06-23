import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { AiService } from "./ai.service";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { UserDec } from "../../common/decorators/user.decorator";
import { formatResponse } from "../../utils/formatResponse";

@Controller("ai")
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post("analyze")
  async analyzeResume(@UserDec() user: any, @Body("resumeId") resumeId: string) {
    const analysis = await this.aiService.analyzeResume(user._id, resumeId);
    return formatResponse(analysis, "Resume analysis completed");
  }

  @Post("ats-optimize")
  async optimizeForATS(
    @Body("resumeId") resumeId: string,
    @Body("jobDescription") jobDescription: string
  ) {
    const result = await this.aiService.optimizeForAts(resumeId, jobDescription);
    return formatResponse(result, "ATS optimization completed");
  }

  @Post("suggestions")
  async suggestImprovements(
    @Body("resumeId") resumeId: string,
    @Body("section") section: string
  ) {
    const result = await this.aiService.improveResume(resumeId, section);
    return formatResponse(result, "Resume improved");
  }

  @Post("job-matches")
  async generateJobMatches(
    @Body("resumeId") resumeId: string,
    @Body("jobDescriptions") jobDescriptions: string[]
  ) {
    const result = await this.aiService.matchJobDescriptions(resumeId, jobDescriptions);
    return formatResponse(result, "Job matching completed");
  }

  @Post("interview-questions")
  async generateInterviewQuestions(
    @Body("resumeId") resumeId: string,
    @Body("jobDescription") jobDescription: string
  ) {
    const questions = await this.aiService.generateInterviewQuestions(resumeId, jobDescription);
    return formatResponse(questions, "Interview questions generated");
  }

  @Post("extract-skills")
  async extractSkills(@Body("resumeId") resumeId: string) {
    const skills = await this.aiService.extractSkills(resumeId);
    return formatResponse(skills, "Skills extracted");
  }
}
