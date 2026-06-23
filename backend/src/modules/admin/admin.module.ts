import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../../models/User";
import { Resume, ResumeSchema } from "../../models/Resume";
import { Subscription, SubscriptionSchema } from "../../models/Subscription";
import { AdminLog, AdminLogSchema } from "../../models/AdminLog";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Resume.name, schema: ResumeSchema },
      { name: Subscription.name, schema: SubscriptionSchema },
      { name: AdminLog.name, schema: AdminLogSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
