import Redis, { RedisOptions } from "ioredis";

const isVercel = !!process.env.VERCEL;
const redisHost = process.env.REDIS_HOST || (isVercel ? "" : "127.0.0.1");
const redisPort = Number(process.env.REDIS_PORT) || 6379;
const redisPassword = process.env.REDIS_PASSWORD || undefined;
const redisDb = Number(process.env.REDIS_DB) || 0;

const shouldDisableRedis =
  isVercel &&
  (!process.env.REDIS_HOST ||
    process.env.REDIS_HOST === "127.0.0.1" ||
    process.env.REDIS_HOST === "localhost");

const redisOptions: RedisOptions = {
  host: redisHost || "127.0.0.1",
  port: redisPort,
  password: redisPassword,
  db: redisDb,
  enableOfflineQueue: false,
  lazyConnect: true,
  connectTimeout: 2000,
  maxRetriesPerRequest: 1,
  retryStrategy(times: number) {
    if (times > 1 || shouldDisableRedis) {
      return null;
    }
    return 500;
  },
};

let rawRedis: any = null;
let connected = false;

if (!shouldDisableRedis) {
  try {
    rawRedis = new Redis(redisOptions);

    rawRedis.on("ready", () => {
      connected = true;
      console.log("[Redis Driver] Connected successfully to Redis server.");
    });

    rawRedis.on("connect", () => {
      console.log("[Redis Driver] Connecting to Redis...");
    });

    rawRedis.on("error", (err: any) => {
      console.warn("[Redis Driver] Connection error (safe bypass active):", err.message);
      connected = false;
    });

    rawRedis.on("end", () => {
      connected = false;
    });
  } catch (err: any) {
    console.warn("[Redis Driver] Could not initialize Redis:", err.message);
  }
} else {
  console.log("[Redis Driver] Redis disabled on serverless environment.");
}

const safeRedisProxy = new Proxy(rawRedis || {}, {
  get(target: any, prop: string | symbol) {
    const original = target ? target[prop] : null;

    if (typeof original !== "function") {
      return original;
    }

    if (["on", "once", "removeListener", "removeAllListeners", "quit", "disconnect"].includes(String(prop))) {
      return original.bind(target);
    }

    return async (...args: any[]) => {
      if (!connected || !original) {
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

  }
  process.exit(0);
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

export default safeRedisProxy;
