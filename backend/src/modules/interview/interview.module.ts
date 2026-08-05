import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { InterviewSession, InterviewSessionSchema } from "../../models/InterviewSession";
import { InterviewController } from "./interview.controller";
import { InterviewService } from "./interview.service";
import { AiModule } from "../ai/ai.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InterviewSession.name, schema: InterviewSessionSchema },
    ]),
    AiModule,
  ],
  controllers: [InterviewController],
  providers: [InterviewService],
  exports: [InterviewService],
})
export class InterviewModule {}
