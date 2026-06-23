import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Resume, ResumeSchema } from "../../models/Resume";
import { ResumeAnalysis, ResumeAnalysisSchema } from "../../models/ResumeAnalysis";
import { ResumeController } from "./resume.controller";
import { ResumeService } from "./resume.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Resume.name, schema: ResumeSchema },
      { name: ResumeAnalysis.name, schema: ResumeAnalysisSchema },
    ]),
  ],
  controllers: [ResumeController],
  providers: [ResumeService],
  exports: [ResumeService],
})
export class ResumeModule {}
