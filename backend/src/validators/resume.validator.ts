import { Request, Response, NextFunction } from "express";
import { formatResponse } from "../utils/formatResponse";

function badRequest(res: Response, message: string) {
  return res.status(400).json(formatResponse(null, message, "error"));
}

function isValidUrl(value: unknown) {
  if (typeof value !== "string" || value.trim().length === 0) return false;
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export const validateCreateResume = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { title, fileUrl, fileType, extractedText } = req.body as Record<
    string,
    any
  >;

  if (!title || typeof title !== "string" || title.trim().length === 0) {
    return badRequest(res, "title is required");
  }

  if (!fileUrl || !isValidUrl(fileUrl)) {
    return badRequest(res, "fileUrl must be a valid URL");
  }

  if (!fileType || typeof fileType !== "string") {
    return badRequest(res, "fileType is required");
  }

  const allowedTypes = ["pdf", "docx", "doc", "txt", "jpg", "jpeg", "png"];
  if (!allowedTypes.includes(fileType.toLowerCase())) {
    return badRequest(
      res,
      `fileType must be one of: ${allowedTypes.join(", ")}`,
    );
  }

  if (extractedText !== undefined && typeof extractedText !== "string") {
    return badRequest(res, "extractedText must be a string");
  }

  req.body.title = title.trim();
  req.body.fileType = fileType.trim().toLowerCase();
  next();
};

export const validateUpdateResume = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { title, fileUrl, fileType, extractedText } = req.body as Record<
    string,
    any
  >;

  if (
    title !== undefined &&
    (typeof title !== "string" || title.trim().length === 0)
  ) {
    return badRequest(res, "title must be a non-empty string");
  }

  if (fileUrl !== undefined && !isValidUrl(fileUrl)) {
    return badRequest(res, "fileUrl must be a valid URL");
  }

  if (fileType !== undefined) {
    const allowedTypes = ["pdf", "docx", "doc", "txt", "jpg", "jpeg", "png"];
    if (
      typeof fileType !== "string" ||
      !allowedTypes.includes(fileType.toLowerCase())
    ) {
      return badRequest(
        res,
        `fileType must be one of: ${allowedTypes.join(", ")}`,
      );
    }
    req.body.fileType = fileType.trim().toLowerCase();
  }

  if (extractedText !== undefined && typeof extractedText !== "string") {
    return badRequest(res, "extractedText must be a string");
  }

  if (typeof title === "string") req.body.title = title.trim();
  next();
};

export const validateResumeIdParam = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { resumeId } = req.params;
  if (
    !resumeId ||
    typeof resumeId !== "string" ||
    resumeId.trim().length === 0
  ) {
    return badRequest(res, "resumeId is required");
  }
  next();
};

export const validateResumeQuery = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    page = 1,
    limit = 10,
    query,
    format,
  } = req.query as Record<string, any>;

  if (isNaN(Number(page)) || Number(page) < 1)
    return badRequest(res, "page must be a positive number");
  if (isNaN(Number(limit)) || Number(limit) < 1)
    return badRequest(res, "limit must be a positive number");

  if (query !== undefined && typeof query !== "string") {
    return badRequest(res, "query must be a string");
  }

  if (format !== undefined) {
    const allowedFormats = ["pdf", "docx", "json"];
    if (
      typeof format !== "string" ||
      !allowedFormats.includes(format.toLowerCase())
    ) {
      return badRequest(
        res,
        `format must be one of: ${allowedFormats.join(", ")}`,
      );
    }
  }

  next();
};

export const validateResumeShare = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { resumeId } = req.params;
  if (!resumeId || typeof resumeId !== "string") {
    return badRequest(res, "resumeId is required");
  }
  next();
};

export default {
  validateCreateResume,
  validateUpdateResume,
  validateResumeIdParam,
  validateResumeQuery,
  validateResumeShare,
};
