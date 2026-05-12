import { createClient } from "redis";

export const redis = createClient({
  url: process.env.REDIS_URL,
});

export const connectRedis = async () => {
  try {
    console.log("🔄 Connecting to Redis...");
    await redis.connect();
    console.log("✅ Redis connected");
  } catch (err) {
    console.error("❌ Redis error:", err);
  }
};