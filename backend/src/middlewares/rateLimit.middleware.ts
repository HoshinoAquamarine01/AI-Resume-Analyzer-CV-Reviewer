import { Request, Response, NextFunction } from "express";
import { formatResponse } from "../utils/formatResponse";

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

const store: RateLimitStore = {};

interface RateLimitOptions {
  windowMs?: number;
  maxRequests?: number;
  keyGenerator?: (req: Request) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

export const createRateLimit = (options: RateLimitOptions = {}) => {
  const windowMs = options.windowMs || 15 * 60 * 1000; // 15 minutes
  const maxRequests = options.maxRequests || 100;
  const keyGenerator =
    options.keyGenerator ||
    ((req: Request) => req.ip || req.socket.remoteAddress || "unknown");
  const skipSuccessfulRequests = options.skipSuccessfulRequests || false;
  const skipFailedRequests = options.skipFailedRequests || false;

  return (req: Request, res: Response, next: NextFunction) => {
    const key = keyGenerator(req);
    const now = Date.now();
    const record = store[key];

    if (!record || now > record.resetTime) {
      store[key] = { count: 1, resetTime: now + windowMs };
      return next();
    }

    record.count++;

    res.set("X-RateLimit-Limit", maxRequests.toString());
    res.set("X-RateLimit-Remaining", (maxRequests - record.count).toString());
    res.set("X-RateLimit-Reset", Math.ceil(record.resetTime / 1000).toString());

    if (record.count > maxRequests) {
      return res
        .status(429)
        .json(
          formatResponse(
            null,
            "Too many requests, please try again later",
            "error",
          ),
        );
    }

    next();
  };
};

export const globalRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000,
  maxRequests: 100,
});

export const authRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000,
  maxRequests: 10,
});

export const apiRateLimit = createRateLimit({
  windowMs: 1 * 60 * 1000,
  maxRequests: 30,
});
