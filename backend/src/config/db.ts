import Redis, { RedisOptions } from "ioredis";

const redisHost = process.env.REDIS_HOST || "127.0.0.1";
const redisPort = Number(process.env.REDIS_PORT) || 6379;
const redisPassword = process.env.REDIS_PASSWORD || undefined;
const redisDb = Number(process.env.REDIS_DB) || 0;

const redisOptions: RedisOptions = {
  host: redisHost,
  port: redisPort,
  password: redisPassword,
  db: redisDb,
  enableOfflineQueue: false,
  connectTimeout: 5000,
  maxRetriesPerRequest: 1,
  retryStrategy(times) {
    const delay = Math.min(times * 100, 3000);
    console.warn(`[Redis Driver] Lost connection, retrying in ${delay} ms (attempt ${times})`);
    return delay;
  },
};

const rawRedis = new Redis(redisOptions);
let connected = false;

rawRedis.on("ready", () => {
  connected = true;
  console.log("[Redis Driver] Connected successfully to Redis server.");
});

rawRedis.on("connect", () => {
  console.log("[Redis Driver] Connecting to Redis...");
});

rawRedis.on("error", (err) => {
  console.error("[Redis Driver] Connection error:", err.message);
  connected = false;
});

rawRedis.on("reconnect", () => {
  console.log("[Redis Driver] Reconnecting to Redis...");
});

rawRedis.on("end", () => {
  console.warn("[Redis Driver] Redis connection closed.");
  connected = false;
});

// Safe Proxy wrapping rawRedis methods to prevent app crashes when Redis is offline or fails
const safeRedisProxy = new Proxy(rawRedis, {
  get(target: any, prop: string | symbol) {
    const original = target[prop];

    if (typeof original !== "function") {
      return original;
    }

    if (["on", "once", "removeListener", "removeAllListeners", "quit", "disconnect"].includes(String(prop))) {
      return original.bind(target);
    }

    return async (...args: any[]) => {
      if (!connected) {
        console.warn(`[Redis Safe Proxy] Redis is offline. Bypassing '${String(prop)}' call.`);
        return null;
      }
      try {
        return await original.apply(target, args);
      } catch (err: any) {
        console.error(`[Redis Safe Proxy] Error during '${String(prop)}':`, err?.message || err);
        return null;
      }
    };
  },
});

export const redisWrapper = {
  async get(key: string): Promise<string | null> {
    if (!connected) return null;
    try {
      return await rawRedis.get(key);
    } catch (error) {
      console.error("Redis Get Error:", error);
      return null;
    }
  },
  async set(key: string, value: string, ttlSeconds?: number): Promise<boolean> {
    if (!connected) return false;
    try {
      if (ttlSeconds) {
        await rawRedis.set(key, value, "EX", ttlSeconds);
      } else {
        await rawRedis.set(key, value);
      }
      return true;
    } catch (error) {
      console.error("Redis Set Error:", error);
      return false;
    }
  },
  async delete(key: string): Promise<boolean> {
    if (!connected) return false;
    try {
      await rawRedis.del(key);
      return true;
    } catch (error) {
      console.error("Redis Delete Error:", error);
      return false;
    }
  },
  get isConnected(): boolean {
    return connected;
  },
  get client() {
    return safeRedisProxy;
  },
};

const gracefulShutdown = async () => {
  console.log("Closing Redis Connection");
  try {
    await rawRedis.quit();
  } catch {
    // Ignore error on shutdown
  }
  process.exit(0);
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

export default safeRedisProxy;