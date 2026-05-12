import { Response, NextFunction } from "express";
import { formatResponse } from "../utils/formatResponse";
import { AuthRequest } from "./auth.middleware";

export type UserRole = "user" | "admin" | "premium";

export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res
        .status(401)
        .json(formatResponse(null, "Unauthorized", "error"));
    }

    if (!allowedRoles.includes(req.user.role as UserRole)) {
      return res
        .status(403)
        .json(
          formatResponse(null, "Forbidden - insufficient permissions", "error"),
        );
    }

    next();
  };
};

export const isAdmin = authorize("admin");
export const isPremium = authorize("premium", "admin");
export const isUser = authorize("user", "premium", "admin");
