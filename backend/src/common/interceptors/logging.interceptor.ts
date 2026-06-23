import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

interface RequestLog {
  timestamp: string;
  method: string;
  url: string;
  ip: string;
  status?: number;
  duration: number;
}

const logs: RequestLog[] = [];

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const response = httpContext.getResponse();
    const startTime = Date.now();
    const ip =
      request.headers["x-forwarded-for"] ||
      request.socket.remoteAddress ||
      "unknown";

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        const log: RequestLog = {
          timestamp: new Date().toISOString(),
          method: request.method,
          url: request.originalUrl || request.url,
          ip: typeof ip === "string" ? ip.split(",")[0] : ip,
          status: response.statusCode,
          duration,
        };

        logs.push(log);
        if (logs.length > 1000) {
          logs.shift();
        }

        const logLevel = response.statusCode >= 400 ? "ERROR" : "INFO";
        console.log(
          `[${logLevel}] ${log.method} ${log.url} - ${log.status} (${log.duration}ms)`
        );
      })
    );
  }
}

export const getRequestLogs = () => logs;
