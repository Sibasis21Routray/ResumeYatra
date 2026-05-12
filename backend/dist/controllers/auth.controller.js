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
exports.register = register;
exports.login = login;
exports.me = me;
exports.forgotPassword = forgotPassword;
exports.resetPassword = resetPassword;
const authService = __importStar(require("../services/auth.service"));
const crypto_1 = __importDefault(require("crypto"));
const User_1 = __importDefault(require("../models/User"));
const sendEmail_1 = require("../utils/sendEmail");
async function register(req, res) {
    try {
        const { email, name, password, mobile, state, city, pin, razorpay_order_id, razorpay_subscription_id, razorpay_payment_id, razorpay_signature, type, autoPay, includeItem, resumeId, } = req.body;
        // ✅ Required fields check
        if (!email || !password || !name || !mobile || !state || !city || !pin) {
            return res.status(400).json({ error: "All fields are required" });
        }
        // ✅ Name validation
        if (!/^[A-Za-z ]{3,}$/.test(name.trim())) {
            return res.status(400).json({ error: "Invalid name" });
        }
        // ✅ Email validation
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({ error: "Invalid email" });
        }
        // ✅ Password validation
        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters" });
        }
        // ✅ Mobile validation (India)
        if (!/^[6-9]\d{9}$/.test(mobile)) {
            return res.status(400).json({ error: "Invalid mobile number" });
        }
        // ✅ State / City validation
        if (!state.trim() || !city.trim()) {
            return res.status(400).json({ error: "State and city are required" });
        }
        // ✅ PIN validation
        if (!/^[1-9][0-9]{5}$/.test(pin)) {
            return res.status(400).json({ error: "Invalid PIN code" });
        }
        // ✅ Call service
        const result = await authService.register(email, name.trim(), password, {
            mobile,
            state: state.trim(),
            city: city.trim(),
            pin,
        }, {
            razorpay_order_id,
            razorpay_subscription_id,
            razorpay_payment_id,
            razorpay_signature,
            type,
            autoPay,
            includeItem,
            resumeId,
        });
        res.status(201).json(result);
    }
    catch (err) {
        console.error("register error:", err);
        res.status(400).json({ error: err.message || "registration failed" });
    }
}
async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ error: 'email and password required' });
        const result = await authService.login(email, password);
        res.json(result);
    }
    catch (err) {
        console.error('login error:', err);
        res.status(401).json({ error: err.message || 'login failed' });
    }
}
async function me(req, res) {
    try {
        const userId = req.userId;
        if (!userId)
            return res.status(401).json({ error: 'not authenticated' });
        const user = await authService.getUserById(userId);
        if (!user)
            return res.status(404).json({ error: 'user not found' });
        res.json({
            id: user.id,
            email: user.email,
            name: user.name,
            subscriptionPlan: user.subscriptionPlan,
            autoPay: user.autoPay,
            razorpaySubscriptionId: user.razorpaySubscriptionId,
            mobile: user.mobile,
            state: user.state,
            city: user.city,
            pin: user.pin
        });
    }
    catch (err) {
        console.error('me error:', err);
        res.status(500).json({ error: err.message || 'internal error' });
    }
}
async function forgotPassword(req, res) {
    try {
        const { email } = req.body;
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            return res.status(400).json({ error: "Valid email is required" });
        }
        const user = await User_1.default.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found with this email" });
        }
        // Generate token
        const resetToken = crypto_1.default.randomBytes(32).toString("hex");
        // Hash token before saving
        const hashedToken = crypto_1.default
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min
        await user.save();
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        const emailTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f9; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
          .header { background-color: #01467d; padding: 30px; text-align: center; }
          .header h1 { color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px; }
          .content { padding: 40px 30px; line-height: 1.6; color: #333333; }
          .content h2 { margin-top: 0; color: #01467d; }
          .btn-container { text-align: center; margin: 35px 0; }
          .btn { background-color: #01467d; color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; box-shadow: 0 2px 5px rgba(1, 70, 125, 0.3); }
          .footer { background-color: #fbfcfd; padding: 20px; text-align: center; font-size: 12px; color: #8898aa; border-top: 1px solid #edf2f7; }
          .expiry { font-size: 13px; color: #e53e3e; font-weight: 500; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>ResumeYatra</h1>
          </div>
          <div class="content">
            <h2>Forgot your password?</h2>
            <p>Hello,</p>
            <p>We received a request to reset the password for your ResumeYatra account. Click the button below to choose a new password:</p>
            <div class="btn-container">
              <a href="${resetLink}" class="btn">Reset Password</a>
            </div>
            <p>If you did not request a password reset, you can safely ignore this email. Only a person with access to your email can reset your account password.</p>
            <p class="expiry">⚠️ This link will expire in 15 minutes for your security.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ResumeYatra. All rights reserved.</p>
            <p>Building careers, one resume at a time.</p>
          </div>
        </div>
      </body>
      </html>
    `;
        await (0, sendEmail_1.sendEmail)(user.email, "Reset Your Password - ResumeYatra", emailTemplate);
        res.json({ message: "Password reset link sent to your email" });
    }
    catch (err) {
        console.error("forgot password error:", err);
        res.status(500).json({ error: "Something went wrong" });
    }
}
async function resetPassword(req, res) {
    try {
        const { password } = req.body;
        if (!password || password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters" });
        }
        const token = req.params.token;
        const hashedToken = crypto_1.default
            .createHash("sha256")
            .update(token)
            .digest("hex");
        const user = await User_1.default.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: new Date() },
        });
        if (!user) {
            return res.status(400).json({ error: "Token invalid or expired" });
        }
        user.password = await authService.hashPassword(password);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.json({ message: "Password reset successful" });
    }
    catch (err) {
        console.error("reset password error:", err);
        res.status(500).json({ error: "Something went wrong" });
    }
}
