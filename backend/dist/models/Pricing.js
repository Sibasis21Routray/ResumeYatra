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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const pricing_config_1 = require("../config/pricing.config");
const PricingSchema = new mongoose_1.Schema({
    freelancerPrice: { type: Number, required: true, default: pricing_config_1.PRICING.FREELANCER.PRICE },
    freelancerDurationMonths: { type: Number, required: true, default: pricing_config_1.PRICING.FREELANCER.DURATION_MONTHS },
    freelancerResumeLimit: { type: Number, required: true, default: pricing_config_1.PRICING.FREELANCER.RESUME_LIMIT },
    freelancerAiDiscount: { type: Number, required: true, default: pricing_config_1.PRICING.FREELANCER.AI_DISCOUNT_PERCENT },
    candidatePrice: { type: Number, required: true, default: pricing_config_1.PRICING.CANDIDATE.PRICE },
    candidateDurationMonths: { type: Number, required: true, default: pricing_config_1.PRICING.CANDIDATE.DURATION_MONTHS },
    candidateResumeLimit: { type: Number, required: true, default: pricing_config_1.PRICING.CANDIDATE.RESUME_LIMIT },
    candidateAiDiscount: { type: Number, required: true, default: pricing_config_1.PRICING.CANDIDATE.AI_DISCOUNT_PERCENT },
    guestDownload: { type: Number, required: true, default: pricing_config_1.PRICING.GUEST.DOWNLOAD },
    guestAi: { type: Number, required: true, default: pricing_config_1.PRICING.GUEST.AI },
    candidatePlanId: { type: String },
    freelancerPlanId: { type: String },
    autoPayCycleLimit: { type: Number, required: true, default: 5 },
    adminSignature: { type: String },
});
exports.default = mongoose_1.default.model('Pricing', PricingSchema);
