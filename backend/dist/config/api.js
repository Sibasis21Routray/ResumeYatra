"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const NODE_ENV = process.env.NODE_ENV || 'development';
// Load specific env file based on NODE_ENV. Do not call dotenv elsewhere.
const envFile = NODE_ENV === 'production' ? '.env.production' : '.env.development';
// Resolve env file from a few likely locations so the module is robust whether
// the developer runs commands from the repo root or from the `backend` folder.
const candidates = [
    path_1.default.resolve(process.cwd(), envFile), // when cwd is backend
    path_1.default.resolve(process.cwd(), 'backend', envFile), // when cwd is repo root
    path_1.default.resolve(__dirname, '..', '..', envFile), // relative to this file
];
let loadedPath = null;
for (const p of candidates) {
    try {
        // require('fs').accessSync would throw if not exists but avoid importing fs sync repeatedly
        // Use dotenv to attempt loading; it will silently ignore missing files but we still capture the path
        const result = dotenv_1.default.config({ path: p });
        if (!result.error) {
            loadedPath = p;
            break;
        }
    }
    catch {
        // ignore
    }
}
if (!loadedPath) {
    // As a fallback, call dotenv with no path to allow default .env lookup
    dotenv_1.default.config();
}
const toInt = (v, fallback) => {
    if (!v)
        return fallback;
    const n = parseInt(v, 10);
    return Number.isNaN(n) ? fallback : n;
};
const config = {
    nodeEnv: NODE_ENV,
    port: toInt(process.env.PORT, 4000),
    databaseUrl: process.env.DATABASE_URL || '',
    // Redis is optional; leave undefined when not configured
    redisUrl: process.env.REDIS_URL || undefined,
    // Cloudinary URL (optional). Example: CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
    cloudinaryUrl: process.env.CLOUDINARY_URL || process.env.CLOUDINARY_URL_LOCAL || '',
    jwtSecret: process.env.JWT_SECRET || 'change-me',
    // OpenAI API key (optional)
    openaiApiKey: process.env.OPENAI_API_KEY || '',
};
exports.default = config;
