import jwt from "jsonwebtoken";

const getJwtSecret = () => process.env.JWT_SECRET || "secret";

export const generateToken = (payload: any, expiresIn = "24h") => {
  return (jwt as any).sign(payload, getJwtSecret(), { expiresIn });
};

export const verifyToken = (token: string) => {
  try {
    return (jwt as any).verify(token, getJwtSecret());
  } catch {
    return null;
  }
};
