"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRICING = void 0;
/**
 * Pricing configuration for ResumeYatra
 * Amounts are in local currency (INR) multiplied by 100 for Razorpay (Paise)
 */
exports.PRICING = {
    FREELANCER: {
        PRICE: 9900, // ₹99
        DURATION_MONTHS: 3,
        RESUME_LIMIT: 100,
        AI_DISCOUNT_PERCENT: 50,
    },
    CANDIDATE: {
        PRICE: 2900, // ₹29
        DURATION_MONTHS: 3,
        RESUME_LIMIT: 5,
        AI_DISCOUNT_PERCENT: 25,
    },
    // Guest pricing
    GUEST: {
        DOWNLOAD: 900, // ₹9
        AI: 4900, // ₹49
    }
};
