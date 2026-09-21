import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { LOG_ACTIVITY_KEY } from "../decorators/activity-log.decorator";
import { ActivityLogService } from "../../modules/activity-log/activity-log.service";

@Injectable()
export class ActivityLogInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly activityLogService: ActivityLogService
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const action = this.reflector.getAllAndOverride<string>(LOG_ACTIVITY_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!action) {
      return next.handle();
    }

    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest();
    const rawIp =
      req.headers["x-forwarded-for"] || req.ip || req.socket?.remoteAddress || "unknown";
    const ipAddress = typeof rawIp === "string" ? rawIp.split(",")[0].trim() : String(rawIp);

    return next.handle().pipe(
      tap(async (resData) => {
        try {
          
          const userId =
            req.user?._id ||
            req.user?.id ||
            req.user?.userId ||
            resData?.data?.user?._id ||
            resData?.user?._id;

          if (!userId) return;

          const details: Record<string, unknown> = {};
          if (resData?.data) {
            if (resData.data._id) details.resourceId = resData.data._id;
            if (resData.data.title) details.title = resData.data.title;
            if (resData.data.fileUrl) details.fileUrl = resData.data.fileUrl;
            if (resData.data.fileType) details.fileType = resData.data.fileType;
            if (resData.data.jobTitle) details.jobTitle = resData.data.jobTitle;
            if (resData.data.companyName) details.companyName = resData.data.companyName;
            if (resData.data.sessionType) details.sessionType = resData.data.sessionType;
            if (resData.data.overallScore !== undefined) details.overallScore = resData.data.overallScore;
          }

          if (req.body?.resumeId) details.resumeId = req.body.resumeId;
          if (req.body?.sessionId) details.sessionId = req.body.sessionId;
          if (req.params?.resumeId) details.resumeId = req.params.resumeId;
          if (req.params?.sessionId) details.sessionId = req.params.sessionId;

          await this.activityLogService.createLog(userId, action, details, ipAddress);
        } catch (err) {
          console.error("ActivityLogInterceptor error:", err);
        }
      })
    );
  }
}
