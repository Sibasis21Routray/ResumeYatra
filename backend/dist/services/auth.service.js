"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
exports.register = register;
exports.login = login;
exports.getUserById = getUserById;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const api_1 = __importDefault(require("../config/api"));
const User_1 = __importDefault(require("../models/User"));
const Resume_1 = __importDefault(require("../models/Resume"));
async function hashPassword(password) {
    return bcryptjs_1.default.hash(password, 10);
}
async function comparePassword(password, hash) {
    return bcryptjs_1.default.compare(password, hash);
}
function generateToken(userId) {
    return jsonwebtoken_1.default.sign({ userId }, api_1.default.jwtSecret, { expiresIn: '7d' });
}
function verifyToken(token) {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, api_1.default.jwtSecret);
        return { userId: decoded.userId };
    }
    catch {
        return null;
    }
}
const crypto_1 = __importDefault(require("crypto"));
async function register(email, name, password, userData, paymentData) {
    // 1. Verify Payment
    const { razorpay_order_id, razorpay_subscription_id, razorpay_payment_id, razorpay_signature, type, autoPay, includeItem, resumeId } = paymentData;
    const { mobile, state, city, pin } = userData;
    // For subscriptions, razorpay_order_id is missing, but razorpay_subscription_id is present
    const orderOrSubId = razorpay_order_id || razorpay_subscription_id;
    if (!orderOrSubId || !razorpay_payment_id || !razorpay_signature) {
        throw new Error('Payment verification details missing');
    }
    // Signature body is different for orders vs subscriptions
    const body = razorpay_order_id
        ? `${razorpay_order_id}|${razorpay_payment_id}`
        : `${razorpay_payment_id}|${razorpay_subscription_id}`;
    const expectedSignature = crypto_1.default
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body)
        .digest("hex");
    if (expectedSignature !== razorpay_signature) {
        throw new Error('Invalid payment signature');
    }
    // 2. Check if user already exists
    const existingUser = await User_1.default.findOne({ email });
    if (existingUser)
        throw new Error('User already exists');
    const hashedPassword = await hashPassword(password);
    // 3. Create user with correct subscription limits based on type
    let subscriptionPlan = 'candidate';
    let durationMonths = 3;
    if (type === 'subscription_freelancer') {
        subscriptionPlan = 'freelancer';
        const { getPricingConfig } = require('../controllers/pricing.controller');
        const pricing = await getPricingConfig();
        durationMonths = pricing.freelancerDurationMonths;
    }
    else if (type === 'subscription_candidate') {
        subscriptionPlan = 'candidate';
        const { getPricingConfig } = require('../controllers/pricing.controller');
        const pricing = await getPricingConfig();
        durationMonths = pricing.candidateDurationMonths;
    }
    const subscriptionExpiry = new Date();
    subscriptionExpiry.setDate(subscriptionExpiry.getDate() + (durationMonths * 30));
    console.log(`[AuthService] Registering user ${email} with subId: ${razorpay_subscription_id}`);
    const user = new User_1.default({
        email,
        name,
        password: hashedPassword,
        mobile,
        state,
        city,
        pin,
        subscriptionExpiry,
        subscriptionPlan,
        autoPay: autoPay || false,
        razorpaySubscriptionId: razorpay_subscription_id
    });
    console.log(`[AuthService] Saving user object:`, {
        id: user._id,
        autoPay: user.autoPay,
        subId: user.razorpaySubscriptionId
    });
    await user.save();
    // 4. Handle combined item if present
    if (includeItem && resumeId) {
        const resume = await Resume_1.default.findById(resumeId);
        if (resume) {
            if (includeItem === "download") {
                resume.isDownloadPaid = true;
            }
            else if (includeItem === "ai") {
                resume.isAiPaid = true;
                resume.isDownloadPaid = true;
            }
            resume.ownerId = user._id; // Link to the newly created user
            await resume.save();
            console.log(`[AuthService] Marked resume ${resumeId} as paid for ${includeItem} and linked to user ${user._id}`);
            // Handle invoice generation if possible
            try {
                const { getPricingConfig } = require('../controllers/pricing.controller');
                const { createAndSaveInvoice } = require('./invoice.service');
                const pricing = await getPricingConfig();
                let totalAmount = (pricing[subscriptionPlan === 'freelancer' ? 'freelancerPrice' : 'candidatePrice'] || 0);
                let itemPrice = includeItem === "download" ? pricing.guestDownload : pricing.guestAi;
                const discount = subscriptionPlan === 'freelancer' ? pricing.freelancerAiDiscount : pricing.candidateAiDiscount;
                itemPrice = itemPrice * (1 - (discount || 0) / 100);
                totalAmount += itemPrice;
                await createAndSaveInvoice({
                    userId: user._id,
                    resumeId: resumeId,
                    type: includeItem ? `${type}:${includeItem}` : type,
                    amount: Math.round(totalAmount) / 100,
                    paymentId: razorpay_payment_id,
                    orderId: razorpay_order_id || razorpay_subscription_id,
                    userDetails: {
                        name: user.name || "User",
                        email: user.email,
                        phone: user.mobile
                    }
                });
            }
            catch (invErr) {
                console.error("[AuthService] Invoice generation failed:", invErr);
            }
        }
    }
    else if (orderOrSubId) {
        // Normal registration invoice (no combined item)
        try {
            const { createAndSaveInvoice } = require('./invoice.service');
            const { getPricingConfig } = require('../controllers/pricing.controller');
            const pricing = await getPricingConfig();
            const amount = (pricing[subscriptionPlan === 'freelancer' ? 'freelancerPrice' : 'candidatePrice'] || 0) / 100;
            await createAndSaveInvoice({
                userId: user._id,
                type: type,
                amount: amount,
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id || razorpay_subscription_id,
                userDetails: {
                    name: user.name || "User",
                    email: user.email,
                    phone: user.mobile
                }
            });
        }
        catch (invErr) {
            console.error("[AuthService] Signup invoice generation failed:", invErr);
        }
    }
    const token = generateToken(user._id.toString());
    return { user: { id: user._id.toString(), email: user.email, name: user.name, role: user.role, subscriptionExpiry: user.subscriptionExpiry, subscriptionPlan: user.subscriptionPlan, autoPay: user.autoPay, razorpaySubscriptionId: user.razorpaySubscriptionId }, token };
}
async function login(email, password) {
    const user = await User_1.default.findOne({ email });
    if (!user)
        throw new Error('Invalid credentials');
    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch)
        throw new Error('Invalid credentials');
    const token = generateToken(user._id.toString());
    return { user: { id: user._id.toString(), email: user.email, name: user.name, role: user.role, subscriptionPlan: user.subscriptionPlan, autoPay: user.autoPay, razorpaySubscriptionId: user.razorpaySubscriptionId }, token };
}
async function getUserById(userId) {
    return User_1.default.findById(userId);
}
