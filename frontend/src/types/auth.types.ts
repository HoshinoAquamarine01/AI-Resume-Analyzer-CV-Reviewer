// Authentication related TypeScript types

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
  name?: string;
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

export interface ResetPasswordDTO {
  token: string;
  newPassword: string;
}

export interface AuthUser {
  id: string;
  _id?: string;
  email: string;
  name?: string;
  role?: Role;
  roles?: Role[];
  avatarUrl?: string;
  isEmailVerified?: boolean;
}

export interface AuthResponse {
  user: AuthUser;
  tokens?: Tokens;
  token?: string;
  message?: string;
}

export default AuthUser;
