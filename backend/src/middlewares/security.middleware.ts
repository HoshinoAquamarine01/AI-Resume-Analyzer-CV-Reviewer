import { Request, Response, NextFunction } from "express";
import helmet from "helmet";

export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
    },
  },
  frameguard: { action: "deny" },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
});

export const sanitizeInput = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Basic XSS prevention - sanitize string inputs
  const sanitize = (input: any): any => {
    if (typeof input === "string") {
      return input
        .replace(/[<>"']/g, (match) => {
          const map: { [key: string]: string } = {
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
          };
          return map[match];
        })
        .trim();
    }
    if (typeof input === "object" && input !== null) {
      Object.keys(input).forEach((key) => {
        input[key] = sanitize(input[key]);
      });
    }
    return input;
  };

  if (req.body) {
    req.body = sanitize(req.body);
  }
  if (req.query) {
    req.query = sanitize(req.query);
  }

  next();
};
