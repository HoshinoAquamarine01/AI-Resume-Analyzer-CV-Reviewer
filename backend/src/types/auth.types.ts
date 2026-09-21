
export type Role = "user" | "admin" | "moderator" | string;

export interface JWTPayload {
  sub: string;
  email?: string;
  roles?: Role[];
  iat?: number;
  exp?: number;
}

export interface Tokens {
  accessToken: string;
  refreshToken?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordDTO {
  email: string;
}

export interface AuthUser {
  id: string;
  email: string;
  roles?: Role[];
  firstName?: string;
  lastName?: string;
}

export default JWTPayload;
