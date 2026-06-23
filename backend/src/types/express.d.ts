import type { JWTPayload, AuthUser } from "./auth.types";

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload | AuthUser | null;
      requestId?: string;
    }
  }
}

export {};
