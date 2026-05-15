import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const generateToken = (payload: any, expiresIn = "24h") => {
  // Cast to any to avoid typing friction with different jsonwebtoken versions
  return (jwt as any).sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token: string) => {
  try {
    return (jwt as any).verify(token, JWT_SECRET);
  } catch {
    return null;
  }
};
