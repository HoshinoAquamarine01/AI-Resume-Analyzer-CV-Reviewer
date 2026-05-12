import { Request, Response, NextFunction } from "express";

interface RequestLog {
  timestamp: string;
  method: string;
  url: string;
  ip: string;
  status?: number;
  duration: number;
}

const logs: RequestLog[] = [];

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const startTime = Date.now();
  const ip =
    (req.headers["x-forwarded-for"] as string) ||
    req.socket.remoteAddress ||
    "unknown";

  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const log: RequestLog = {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      ip: typeof ip === "string" ? ip.split(",")[0] : ip,
      status: res.statusCode,
      duration,
    };

    logs.push(log);

    if (logs.length > 1000) {
      logs.shift();
    }

    const logLevel = res.statusCode >= 400 ? "ERROR" : "INFO";
    console.log(
      `[${logLevel}] ${log.method} ${log.url} - ${log.status} (${log.duration}ms)`,
    );
  });

  next();
};

export const getRequestLogs = () => logs;
