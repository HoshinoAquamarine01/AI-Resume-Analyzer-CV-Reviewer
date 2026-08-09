import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleModule } from "@nestjs/schedule";
import * as path from "path";

// Import Custom Modules
import { AuthModule } from "./modules/auth/auth.module";
import { UserModule } from "./modules/user/user.module";
import { ResumeModule } from "./modules/resume/resume.module";
import { CoverLetterModule } from "./modules/cover-letter/cover-letter.module";
import { InterviewModule } from "./modules/interview/interview.module";
import { AdminModule } from "./modules/admin/admin.module";
import { AiModule } from "./modules/ai/ai.module";
import { JobsModule } from "./modules/jobs/jobs.module";
import { ActivityLogModule } from "./modules/activity-log/activity-log.module";
import { PaymentModule } from "./modules/payment/payment.module";

@Module({
  imports: [
    // Global Configurations
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.resolve(__dirname, "../../.env"),
    }),
    
    // Database Connection
    MongooseModule.forRootAsync({
      useFactory: () => {
        const uri = process.env.MONGO_URL;
        if (!uri) {
          throw new Error("MONGO_URL is not defined in environment variables");
        }
        return { uri };
      },
    }),

    // Cron Schedule Support
    ScheduleModule.forRoot(),

    // Feature Modules
    ActivityLogModule,
    AuthModule,
    UserModule,
    ResumeModule,
    CoverLetterModule,
    InterviewModule,
    AdminModule,
    AiModule,
    JobsModule,
    PaymentModule,
  ],
})
export class AppModule {}
