import { Request, Response, NextFunction } from "express";
import { formatResponse } from "../utils/formatResponse";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function badRequest(res: Response, message: string) {
  return res.status(400).json(formatResponse(null, message, "error"));
}

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password, name, phoneNumber } = req.body as Record<
    string,
    any
  >;

  if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
    return badRequest(res, "Valid email is required");
  }

  if (!password || typeof password !== "string" || password.trim().length < 8) {
    return badRequest(res, "Password is required (min length 8)");
  }

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return badRequest(res, "Name is required");
  }

  if (phoneNumber !== undefined && phoneNumber !== null) {
    const phone = String(phoneNumber).trim();
    const phoneOk = /^\+?[0-9\-\s()]{7,20}$/.test(phone);
    if (!phoneOk) return badRequest(res, "phoneNumber has invalid format");
  }


  req.body.email = email.trim();
  req.body.name = name.trim();
  next();
};

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body as Record<string, any>;
  if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
    return badRequest(res, "Valid email is required");
  }

  if (!password || typeof password !== "string" || password.length === 0) {
    return badRequest(res, "Password is required");
  }

  req.body.email = email.trim();
  next();
};

export const validateForgotPassword = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email } = req.body as Record<string, any>;
  if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
    return badRequest(res, "Valid email is required");
  }
  req.body.email = email.trim();
  next();
};

export const validateResetPassword = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { token, newPassword } = req.body as Record<string, any>;
  if (!token || typeof token !== "string" || token.trim().length === 0) {
    return badRequest(res, "Reset token is required");
  }
  if (
    !newPassword ||
    typeof newPassword !== "string" ||
    newPassword.trim().length < 8
  ) {
    return badRequest(res, "New password is required (min length 8)");
  }
  next();
};

export const validateChangePassword = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { currentPassword, newPassword } = req.body as Record<string, any>;
  if (
    !currentPassword ||
    typeof currentPassword !== "string" ||
    currentPassword.length === 0
  ) {
    return badRequest(res, "Current password is required");
  }
  if (
    !newPassword ||
    typeof newPassword !== "string" ||
    newPassword.trim().length < 8
  ) {
    return badRequest(res, "New password is required (min length 8)");
  }
  next();
};

export default {
  validateRegister,
  validateLogin,
  validateForgotPassword,
  validateResetPassword,
  validateChangePassword,
};
