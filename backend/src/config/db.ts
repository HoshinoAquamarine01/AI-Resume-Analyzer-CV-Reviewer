// Database and cache configuration
import mongoose from "mongoose";

class MockRedis {
  private store = new Map<string, string>();

  async get(key: string): Promise<string | null> {
    return this.store.get(key) || null;
  }

  async set(key: string, value: string): Promise<string> {
    this.store.set(key, value);
    return "OK";
  }

  async del(key: string): Promise<number> {
    const exists = this.store.delete(key);
    return exists ? 1 : 0;
  }
}

export const redis = new MockRedis();

export const ConnectDB = async () => {
  try {
    const uri = process.env.MONGO_URL;
    if (!uri) throw new Error("MONGO_URL is not defined");
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    throw err;
  }
};
