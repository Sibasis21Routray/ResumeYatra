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
/** Resolve the owner query from req — works for logged-in users and guests. */
function buildOwnerQuery(req) {
    const userId = req.userId;
    const guestId = req.headers["x-guest-id"];
    if (userId && guestId && guestId.trim()) {
        return { $or: [{ ownerId: userId }, { guestId: guestId.trim() }] };
    }
    if (userId)
        return { ownerId: userId };
    if (guestId && guestId.trim())
        return { guestId: guestId.trim() };
    return null;
}
async function renderResume(req, res) {
    try {
        const resumeId = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        const templateId = req.query.template || "modern";
        const theme = req.query.theme
            ? JSON.parse(req.query.theme)
            : undefined;
        if (!resumeId || resumeId === "undefined")
            return res.status(400).json({ error: "Invalid resume ID" });
        if (!mongoose_1.default.Types.ObjectId.isValid(resumeId))
            return res.status(400).json({ error: "Invalid resume ID" });
        const ownerQuery = buildOwnerQuery(req);
        if (!ownerQuery)
            return res.status(400).json({ error: "Missing user identity (login or x-guest-id header required)" });
        // Verify ownership
        const resume = await Resume_1.default.findOne({ _id: resumeId, ...ownerQuery });
        if (!resume) {
            // Allow admin bypass
            const userId = req.userId;
            if (userId) {
                const user = await User_1.default.findById(userId);
                if (user?.role === "admin") {
                    const adminResume = await Resume_1.default.findById(resumeId);
                    if (!adminResume)
                        return res.status(404).json({ error: "Resume not found" });
                    const html = await templateService.renderResumeHtml(resumeId, templateId, theme);
                    return res.json({ html });
                }
            }
            return res.status(404).json({ error: "Resume not found" });
        }
        // Auto-link ownerId if the user is authenticated but the resume only has a guestId
        const userId = req.userId;
        if (userId && !resume.ownerId) {
            resume.ownerId = new mongoose_1.default.Types.ObjectId(userId);
            resume.guestId = null; // Clear guestId on claim
            await resume.save();
            await User_1.default.findByIdAndUpdate(userId, { $addToSet: { resumes: resumeId } });
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
    let theme;
    let currentData;
    try {
        resumeId = Array.isArray(req.params.id)
            ? req.params.id[0]
            : req.params.id;
        templateId =
            req.query.template ||
                req.body.template ||
                "modern";
        theme = req.query.theme
            ? JSON.parse(req.query.theme)
            : req.body.theme || undefined;
        currentData = req.body.data;
        if (!resumeId || resumeId === "undefined")
            return res.status(400).json({ error: "Invalid resume ID" });
        if (!mongoose_1.default.Types.ObjectId.isValid(resumeId))
            return res.status(400).json({ error: "Invalid resume ID" });
        const ownerQuery = buildOwnerQuery(req);
        if (!ownerQuery)
            return res.status(400).json({ error: "Missing user identity (login or x-guest-id header required)" });
        // Verify ownership
        const resume = await Resume_1.default.findOne({ _id: resumeId, ...ownerQuery });
        if (!resume) {
            // Allow admin bypass
            const userId = req.userId;
            if (userId) {
                const user = await User_1.default.findById(userId);
                if (user?.role === "admin") {
                    const adminResume = await Resume_1.default.findById(resumeId);
                    if (!adminResume)
                        return res.status(404).json({ error: "Resume not found" });
                    const html = await templateService.renderResumeHtml(resumeId, templateId, theme, currentData);
                    return res.send(html);
                }
            }
            return res.status(404).json({ error: "Resume not found" });
        }
        // Auto-link ownerId if the user is authenticated but the resume only has a guestId
        const userId = req.userId;
        if (userId && !resume.ownerId) {
            resume.ownerId = new mongoose_1.default.Types.ObjectId(userId);
            resume.guestId = null; // Clear guestId on claim
            await resume.save();
            await User_1.default.findByIdAndUpdate(userId, { $addToSet: { resumes: resumeId } });
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
