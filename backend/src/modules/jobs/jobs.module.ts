import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../../models/User";
import { Resume, ResumeSchema } from "../../models/Resume";
import { Subscription, SubscriptionSchema } from "../../models/Subscription";
import { AdminLog, AdminLogSchema } from "../../models/AdminLog";
import { InterviewSession, InterviewSessionSchema } from "../../models/InterviewSession";
import { JobsService } from "./jobs.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Resume.name, schema: ResumeSchema },
      { name: Subscription.name, schema: SubscriptionSchema },
      { name: AdminLog.name, schema: AdminLogSchema },
      { name: InterviewSession.name, schema: InterviewSessionSchema },
    ]),
  ],
  providers: [JobsService],
  exports: [JobsService],
})
export class JobsModule {}
