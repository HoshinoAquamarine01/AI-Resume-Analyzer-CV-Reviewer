import { Request, Response, NextFunction } from "express";
import { formatResponse } from "../utils/formatResponse";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

export const validateUpdateProfile = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, phoneNumber, avatarUrl, linkedInUrl, githubUrl } =
    req.body as Record<string, any>;

  if (
    name !== undefined &&
    (typeof name !== "string" || name.trim().length === 0)
  ) {
    return badRequest(res, "name must be a non-empty string");
  }

  if (phoneNumber !== undefined) {
    const phone = String(phoneNumber).trim();
    if (!/^\+?[0-9\-\s()]{7,20}$/.test(phone)) {
      return badRequest(res, "phoneNumber has invalid format");
    }
  }

  if (avatarUrl !== undefined && !isValidUrl(avatarUrl)) {
    return badRequest(res, "avatarUrl must be a valid URL");
  }

  if (linkedInUrl !== undefined && !isValidUrl(linkedInUrl)) {
    return badRequest(res, "linkedInUrl must be a valid URL");
  }

  if (githubUrl !== undefined && !isValidUrl(githubUrl)) {
    return badRequest(res, "githubUrl must be a valid URL");
  }

  if (typeof name === "string") req.body.name = name.trim();
  if (typeof phoneNumber === "string")
    req.body.phoneNumber = phoneNumber.trim();
  next();
};

export const validateUpdateAvatar = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { avatarUrl } = req.body as Record<string, any>;
  if (!avatarUrl || !isValidUrl(avatarUrl)) {
    return badRequest(res, "avatarUrl must be a valid URL");
  }
  next();
};

export const validateUpdateSettings = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name, email, phoneNumber, avatarUrl, linkedInUrl, githubUrl } =
    req.body as Record<string, any>;

  if (
    name !== undefined &&
    (typeof name !== "string" || name.trim().length === 0)
  ) {
    return badRequest(res, "name must be a non-empty string");
  }

  if (
    email !== undefined &&
    (typeof email !== "string" || !emailRegex.test(email.trim()))
  ) {
    return badRequest(res, "email must be valid");
  }

  if (phoneNumber !== undefined) {
    const phone = String(phoneNumber).trim();
    if (!/^\+?[0-9\-\s()]{7,20}$/.test(phone)) {
      return badRequest(res, "phoneNumber has invalid format");
    }
  }

  if (avatarUrl !== undefined && !isValidUrl(avatarUrl)) {
    return badRequest(res, "avatarUrl must be a valid URL");
  }

  if (linkedInUrl !== undefined && !isValidUrl(linkedInUrl)) {
    return badRequest(res, "linkedInUrl must be a valid URL");
  }

  if (githubUrl !== undefined && !isValidUrl(githubUrl)) {
    return badRequest(res, "githubUrl must be a valid URL");
  }

  next();
};

export const validateProfileQuery = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { page = 1, limit = 10 } = req.query as Record<string, any>;
  if (isNaN(Number(page)) || Number(page) < 1)
    return badRequest(res, "page must be a positive number");
  if (isNaN(Number(limit)) || Number(limit) < 1)
    return badRequest(res, "limit must be a positive number");
  next();
};

export default {
  validateUpdateProfile,
  validateUpdateAvatar,
  validateUpdateSettings,
  validateProfileQuery,
};
