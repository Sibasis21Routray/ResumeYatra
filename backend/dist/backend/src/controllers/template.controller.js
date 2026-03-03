"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderResume = renderResume;
exports.renderResumeHtml = renderResumeHtml;
const templateService = __importStar(require("../services/template.service"));
const Resume_1 = __importDefault(require("../models/Resume"));
const User_1 = __importDefault(require("../models/User"));
const mongoose_1 = __importDefault(require("mongoose"));
async function renderResume(req, res) {
    try {
        const resumeId = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        const templateId = req.query.template || "modern";
        const theme = req.query.theme
            ? JSON.parse(req.query.theme)
            : undefined;
        const userId = req.userId;
        if (!resumeId || resumeId === "undefined" || !userId)
            return res.status(400).json({ error: "Invalid resume ID" });
        if (!mongoose_1.default.Types.ObjectId.isValid(resumeId))
            return res.status(400).json({ error: "Invalid resume ID" });
        // Check ownership or admin access
        const resume = await Resume_1.default.findById(resumeId);
        if (!resume)
            return res.status(404).json({ error: "Resume not found" });
        const user = await User_1.default.findById(userId);
        if (!user)
            return res.status(404).json({ error: "User not found" });
        // Allow access if user is owner or admin
        if (resume.ownerId.toString() !== userId && user.role !== "admin") {
            return res.status(403).json({ error: "Access denied" });
        }
        const html = await templateService.renderResumeHtml(resumeId, templateId, theme);
        res.json({ html });
    }
    catch (err) {
        console.error("render error:", err);
        res.status(500).json({ error: err.message || "internal error" });
    }
}
async function renderResumeHtml(req, res) {
    let resumeId = '';
    let templateId = '';
    try {
        resumeId = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        templateId =
            req.query.template ||
                req.body.template ||
                "modern";
        const theme = req.query.theme
            ? JSON.parse(req.query.theme)
            : req.body.theme || undefined;
        const currentData = req.body.data;
        const userId = req.userId;
        if (!resumeId || resumeId === "undefined" || !userId)
            return res.status(400).json({ error: "Invalid resume ID" });
        if (!mongoose_1.default.Types.ObjectId.isValid(resumeId))
            return res.status(400).json({ error: "Invalid resume ID" });
        // Check ownership or admin access
        const resume = await Resume_1.default.findById(resumeId);
        if (!resume)
            return res.status(404).json({ error: "Resume not found" });
        const user = await User_1.default.findById(userId);
        if (!user)
            return res.status(404).json({ error: "User not found" });
        // Allow access if user is owner or admin
        if (resume.ownerId.toString() !== userId && user.role !== "admin") {
            return res.status(403).json({ error: "Access denied" });
        }
        const html = await templateService.renderResumeHtml(resumeId, templateId, theme, currentData);
        res.send(html);
    }
    catch (err) {
        console.error("html render error:", err);
        console.error("Error stack:", err.stack);
        console.error("Error details:", {
            resumeId,
            templateId,
            hasTheme: !!theme,
            hasCurrentData: !!currentData,
            currentDataKeys: currentData ? Object.keys(currentData) : null,
        });
        res.status(500).json({ error: err.message || "internal error" });
    }
}
