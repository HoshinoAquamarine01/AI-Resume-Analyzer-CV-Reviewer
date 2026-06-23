import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Resume, ResumeSchema } from "../../models/Resume";
import { ResumeAnalysis, ResumeAnalysisSchema } from "../../models/ResumeAnalysis";
import { AiController } from "./ai.controller";
import { AiService } from "./ai.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Resume.name, schema: ResumeSchema },
      { name: ResumeAnalysis.name, schema: ResumeAnalysisSchema },
    ]),
  ],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
