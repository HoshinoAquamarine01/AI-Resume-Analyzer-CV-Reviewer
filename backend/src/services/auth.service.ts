import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const authService = {
  register: async (data: any) => {
    return data;
  },

  generateToken: async (userId: any) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET || "secret", {
      expiresIn: "24h",
    });
  },

  generateRefreshToken: async (userId: any) => {
    return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET || "secret", {
      expiresIn: "7d",
    });
  },

  comparePassword: async (password: string, hash: string) => {
    return bcrypt.compare(password, hash);
  },

  verifyRefreshToken: async (token: string) => {
    try {
      return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || "secret");
    } catch {
      return null;
    }
  },

  verifyEmailToken: async (token: string) => {
    try {
      return jwt.verify(token, process.env.EMAIL_TOKEN_SECRET || "secret");
    } catch {
      return null;
    }
  },

  generatePasswordResetToken: async (userId: any) => {
    return jwt.sign({ userId }, process.env.RESET_TOKEN_SECRET || "secret", {
      expiresIn: "1h",
    });
  },

  verifyPasswordResetToken: async (token: string) => {
    try {
      return jwt.verify(token, process.env.RESET_TOKEN_SECRET || "secret");
    } catch {
      return null;
    }
  },

  sendPasswordResetEmail: async (email: string, token: string) => {
    return true;
  },

  hashPassword: async (password: string) => {
    return bcrypt.hash(password, 10);
  },
};
