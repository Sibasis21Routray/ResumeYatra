"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const resumes_1 = __importDefault(require("./resumes"));
const admin_1 = __importDefault(require("./admin"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const templates_1 = __importDefault(require("./templates"));
const router = (0, express_1.Router)();
router.use('/auth', auth_1.default);
// Public templates preview (no auth required)
router.use('/templates', templates_1.default);
router.use('/resumes', auth_middleware_1.authMiddleware, resumes_1.default);
router.use('/admin', auth_middleware_1.authMiddleware, admin_1.default);
exports.default = router;
