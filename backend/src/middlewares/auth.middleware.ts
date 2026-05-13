import { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../config/jwt";
import { formatResponse } from "../utils/formatResponse";
import type { JWTPayload, AuthUser } from "../types";

export interface AuthRequest extends Request {
  user?: JWTPayload | AuthUser | null;
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json(formatResponse(null, "Access token required", "error"));
    }

    const decoded = verifyJwt(token);

    if (!decoded) {
      return res
        .status(403)
        .json(formatResponse(null, "Invalid or expired token", "error"));
    }

    
    const payload = decoded as JWTPayload | null;
    if (payload && (payload as JWTPayload).sub) {
      req.user = {
        id: (payload as JWTPayload).sub,
        email: (payload as JWTPayload).email || "",
       
        role: Array.isArray((payload as JWTPayload).roles)
          ? (payload as JWTPayload).roles![0]
          : (payload as any).role || undefined,
      } as any;
    } else {
      req.user = decoded as any;
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json(formatResponse(null, "Authentication failed", "error"));
  }
};

export const optionalAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
      const decoded = verifyJwt(token);
      if (decoded) {
        const payload = decoded as JWTPayload | null;
        if (payload && (payload as JWTPayload).sub) {
          req.user = {
            id: (payload as JWTPayload).sub,
            email: (payload as JWTPayload).email || "",
            role: Array.isArray((payload as JWTPayload).roles)
              ? (payload as JWTPayload).roles![0]
              : (payload as any).role || undefined,
          } as any;
        } else {
          req.user = decoded as any;
        }
      }
    }

    next();
  } catch (error) {
    next();
  }
};
