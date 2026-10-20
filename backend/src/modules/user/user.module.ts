import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../../models/User";
import { Resume, ResumeSchema } from "../../models/Resume";
import { CoverLetter, CoverLetterSchema } from "../../models/CoverLetter";
import { InterviewSession, InterviewSessionSchema } from "../../models/InterviewSession";
import { ResumeAnalysis, ResumeAnalysisSchema } from "../../models/ResumeAnalysis";
import { JobMatch, JobMatchSchema } from "../../models/JobMatch";
import { Subscription, SubscriptionSchema } from "../../models/Subscription";
import { ActivityLog, ActivityLogSchema } from "../../models/ActivityLog";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Resume.name, schema: ResumeSchema },
      { name: CoverLetter.name, schema: CoverLetterSchema },
      { name: InterviewSession.name, schema: InterviewSessionSchema },
      { name: ResumeAnalysis.name, schema: ResumeAnalysisSchema },
      { name: JobMatch.name, schema: JobMatchSchema },
      { name: Subscription.name, schema: SubscriptionSchema },
      { name: ActivityLog.name, schema: ActivityLogSchema },
    ]),
    AuthModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
