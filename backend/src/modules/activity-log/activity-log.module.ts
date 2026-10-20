import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ActivityLog, ActivityLogSchema } from "../../models/ActivityLog";
import { ActivityLogService } from "./activity-log.service";
import { ActivityLogInterceptor } from "../../common/interceptors/activity-log.interceptor";

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ActivityLog.name, schema: ActivityLogSchema },
    ]),
  ],
  providers: [ActivityLogService, ActivityLogInterceptor],
  exports: [ActivityLogService, ActivityLogInterceptor, MongooseModule],
})
export class ActivityLogModule {}
