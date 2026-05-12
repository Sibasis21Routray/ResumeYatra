"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = __importDefault(require("./config/api"));
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./db/db"));
const redis_1 = require("./config/redis");
const PORT = api_1.default.port;
(0, db_1.default)().then(async () => {
    await (0, redis_1.connectRedis)();
    app_1.default.listen(PORT, () => {
        console.log(`Backend listening on http://localhost:${PORT} (env=${api_1.default.nodeEnv})`);
    });
}).catch((error) => {
    console.error('Failed to connect to database:', error);
    process.exit(1);
});
