import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Resume, ResumeSchema } from "../../models/Resume";
import { ResumeAnalysis, ResumeAnalysisSchema } from "../../models/ResumeAnalysis";
import { AiController } from "./ai.controller";
import { AiService } from "./ai.service";
import { GatewayModule } from "../gateway/gateway.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Resume.name, schema: ResumeSchema },
      { name: ResumeAnalysis.name, schema: ResumeAnalysisSchema },
    ]),
    forwardRef(() => GatewayModule),
  ],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
