"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRedis = exports.redis = void 0;
const redis_1 = require("redis");
exports.redis = (0, redis_1.createClient)({
    url: process.env.REDIS_URL,
});
const connectRedis = async () => {
    try {
        console.log("🔄 Connecting to Redis...");
        await exports.redis.connect();
        console.log("✅ Redis connected");
    }
    catch (err) {
        console.error("❌ Redis error:", err);
    }
};
exports.connectRedis = connectRedis;
