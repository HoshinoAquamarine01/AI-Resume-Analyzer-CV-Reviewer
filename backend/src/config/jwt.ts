import jwt, { SignOptions, VerifyOptions } from "jsonwebtoken";

export const getJwtSecret = () => process.env.JWT_SECRET || "secret";
export const getRefreshTokenSecret = () => process.env.REFRESH_TOKEN_SECRET || "secret";
export const getResetTokenSecret = () => process.env.RESET_TOKEN_SECRET || "secret";
export const getEmailTokenSecret = () => process.env.EMAIL_TOKEN_SECRET || "secret";

export function signJwt(payload: object, options?: SignOptions) {
  return jwt.sign(payload, getJwtSecret(), { ...(options || ({} as SignOptions)) });
}

export function verifyJwt<T = any>(
  token: string,
  options?: VerifyOptions,
): T | null {
  try {
    return jwt.verify(token, getJwtSecret(), options) as T;
  } catch {
    return null;
  }
}
