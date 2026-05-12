"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionMiddleware = subscriptionMiddleware;
const User_1 = __importDefault(require("../models/User"));
/**
 * Middleware to check if a user has an active subscription.
 * Allows Guests, but blocks logged-in users with no/expired subscription.
 */
async function subscriptionMiddleware(req, res, next) {
    try {
        const userId = req.userId;
        // 1. Skip check for guests (They pay per-use at higher rates)
        if (!userId) {
            return next();
        }
        // 2. Find user in database
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // 3. Admin bypass
        if (user.role === 'admin') {
            return next();
        }
        // 4. Check subscription expiry
        if (!user.subscriptionExpiry || user.subscriptionExpiry < new Date()) {
            return res.status(403).json({
                error: 'Active subscription required (₹99 for 3 months)',
                type: 'subscription_required'
            });
        }
        // 5. Success
        next();
    }
    catch (error) {
        console.error('[SubscriptionMiddleware] Error:', error);
        res.status(500).json({ error: 'Internal server error during subscription check' });
    }
}
