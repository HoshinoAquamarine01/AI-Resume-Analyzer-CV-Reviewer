import { Request, Response, NextFunction } from "express";
import { formatResponse } from "../utils/formatResponse";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("[Error]", err);

  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json(formatResponse(null, err.message, "error"));
  }

  if (err instanceof SyntaxError && "body" in err) {
    return res
      .status(400)
      .json(formatResponse(null, "Invalid JSON", "error"));
  }

  return res
    .status(500)
    .json(
      formatResponse(
        null,
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : err.message,
        "error",
      ),
    );
};

export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
