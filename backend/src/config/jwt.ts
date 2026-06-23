
import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";

export const JWT_SECRET = process.env.JWT_SECRET || "secret";
export const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "secret";
export const RESET_TOKEN_SECRET = process.env.RESET_TOKEN_SECRET || "secret";
export const EMAIL_TOKEN_SECRET = process.env.EMAIL_TOKEN_SECRET || "secret";

export function signJwt(payload: object, options?: SignOptions) {
  return jwt.sign(payload, JWT_SECRET, { ...(options || ({} as SignOptions)) });
}

export function verifyJwt<T = any>(
  token: string,
  options?: VerifyOptions,
): T | null {
  try {
    return jwt.verify(token, JWT_SECRET, options) as T;
  } catch {
    return null;
  }
}
