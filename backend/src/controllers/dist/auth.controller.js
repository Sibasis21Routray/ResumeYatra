"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.logout = exports.resetPassword = exports.forgotPassword = exports.me = exports.login = exports.register = void 0;
var authService = require("../services/auth.service");
var crypto_1 = require("crypto");
var User_1 = require("../models/User");
var sendEmail_1 = require("../utils/sendEmail");
function register(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, email, name, password, mobile, state, city, pin, razorpay_order_id, razorpay_subscription_id, razorpay_payment_id, razorpay_signature, type, autoPay, includeItem, resumeId, result, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    _a = req.body, email = _a.email, name = _a.name, password = _a.password, mobile = _a.mobile, state = _a.state, city = _a.city, pin = _a.pin, razorpay_order_id = _a.razorpay_order_id, razorpay_subscription_id = _a.razorpay_subscription_id, razorpay_payment_id = _a.razorpay_payment_id, razorpay_signature = _a.razorpay_signature, type = _a.type, autoPay = _a.autoPay, includeItem = _a.includeItem, resumeId = _a.resumeId;
                    // ✅ Required fields check
                    if (!email || !password || !name || !mobile || !state || !city || !pin) {
                        return [2 /*return*/, res.status(400).json({ error: "All fields are required" })];
                    }
                    // ✅ Name validation
                    if (!/^[A-Za-z ]{3,}$/.test(name.trim())) {
                        return [2 /*return*/, res.status(400).json({ error: "Invalid name" })];
                    }
                    // ✅ Email validation
                    if (!/^\S+@\S+\.\S+$/.test(email)) {
                        return [2 /*return*/, res.status(400).json({ error: "Invalid email" })];
                    }
                    // ✅ Password validation
                    if (password.length < 6) {
                        return [2 /*return*/, res.status(400).json({ error: "Password must be at least 6 characters" })];
                    }
                    // ✅ Mobile validation (India)
                    if (!/^[6-9]\d{9}$/.test(mobile)) {
                        return [2 /*return*/, res.status(400).json({ error: "Invalid mobile number" })];
                    }
                    // ✅ State / City validation
                    if (!state.trim() || !city.trim()) {
                        return [2 /*return*/, res.status(400).json({ error: "State and city are required" })];
                    }
                    // ✅ PIN validation
                    if (!/^[1-9][0-9]{5}$/.test(pin)) {
                        return [2 /*return*/, res.status(400).json({ error: "Invalid PIN code" })];
                    }
                    return [4 /*yield*/, authService.register(email, name.trim(), password, {
                            mobile: mobile,
                            state: state.trim(),
                            city: city.trim(),
                            pin: pin
                        }, {
                            razorpay_order_id: razorpay_order_id,
                            razorpay_subscription_id: razorpay_subscription_id,
                            razorpay_payment_id: razorpay_payment_id,
                            razorpay_signature: razorpay_signature,
                            type: type,
                            autoPay: autoPay,
                            includeItem: includeItem,
                            resumeId: resumeId
                        })];
                case 1:
                    result = _b.sent();
                    // ✅ Set the token in an HttpOnly cookie
                    res.cookie('token', result.token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'none',
                        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                    });
                    res.status(201).json({ user: result.user });
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _b.sent();
                    console.error("register error:", err_1);
                    res.status(400).json({ error: err_1.message || "registration failed" });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.register = register;
function login(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, email, password, result, err_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    _a = req.body, email = _a.email, password = _a.password;
                    if (!email || !password)
                        return [2 /*return*/, res.status(400).json({ error: 'email and password required' })];
                    return [4 /*yield*/, authService.login(email, password)
                        // ✅ Set the token in an HttpOnly cookie
                    ];
                case 1:
                    result = _b.sent();
                    // ✅ Set the token in an HttpOnly cookie
                    res.cookie('token', result.token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'none',
                        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
                    });
                    res.json({ user: result.user });
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _b.sent();
                    console.error('login error:', err_2);
                    res.status(401).json({ error: err_2.message || 'login failed' });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.login = login;
function me(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, user, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    userId = req.userId;
                    if (!userId)
                        return [2 /*return*/, res.status(401).json({ error: 'not authenticated' })];
                    return [4 /*yield*/, authService.getUserById(userId)];
                case 1:
                    user = _a.sent();
                    if (!user)
                        return [2 /*return*/, res.status(404).json({ error: 'user not found' })];
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
                    return [3 /*break*/, 3];
                case 2:
                    err_3 = _a.sent();
                    console.error('me error:', err_3);
                    res.status(500).json({ error: err_3.message || 'internal error' });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.me = me;
function forgotPassword(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var email, user, resetToken, hashedToken, resetLink, emailTemplate, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    email = req.body.email;
                    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
                        return [2 /*return*/, res.status(400).json({ error: "Valid email is required" })];
                    }
                    return [4 /*yield*/, User_1["default"].findOne({ email: email })];
                case 1:
                    user = _a.sent();
                    if (!user) {
                        return [2 /*return*/, res.status(404).json({ error: "User not found with this email" })];
                    }
                    resetToken = crypto_1["default"].randomBytes(32).toString("hex");
                    hashedToken = crypto_1["default"]
                        .createHash("sha256")
                        .update(resetToken)
                        .digest("hex");
                    user.resetPasswordToken = hashedToken;
                    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 min
                    return [4 /*yield*/, user.save()];
                case 2:
                    _a.sent();
                    resetLink = process.env.FRONTEND_URL + "/reset-password/" + resetToken;
                    emailTemplate = "\n      <!DOCTYPE html>\n      <html>\n      <head>\n        <meta charset=\"utf-8\">\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n        <title>Reset Your Password</title>\n        <style>\n          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f9; margin: 0; padding: 0; }\n          .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }\n          .header { background-color: #01467d; padding: 30px; text-align: center; }\n          .header h1 { color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px; }\n          .content { padding: 40px 30px; line-height: 1.6; color: #333333; }\n          .content h2 { margin-top: 0; color: #01467d; }\n          .btn-container { text-align: center; margin: 35px 0; }\n          .btn { background-color: #01467d; color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; box-shadow: 0 2px 5px rgba(1, 70, 125, 0.3); }\n          .footer { background-color: #fbfcfd; padding: 20px; text-align: center; font-size: 12px; color: #8898aa; border-top: 1px solid #edf2f7; }\n          .expiry { font-size: 13px; color: #e53e3e; font-weight: 500; margin-top: 20px; }\n        </style>\n      </head>\n      <body>\n        <div class=\"container\">\n          <div class=\"header\">\n            <h1>ResumeYatra</h1>\n          </div>\n          <div class=\"content\">\n            <h2>Forgot your password?</h2>\n            <p>Hello,</p>\n            <p>We received a request to reset the password for your ResumeYatra account. Click the button below to choose a new password:</p>\n            <div class=\"btn-container\">\n              <a href=\"" + resetLink + "\" class=\"btn\">Reset Password</a>\n            </div>\n            <p>If you did not request a password reset, you can safely ignore this email. Only a person with access to your email can reset your account password.</p>\n            <p class=\"expiry\">\u26A0\uFE0F This link will expire in 15 minutes for your security.</p>\n          </div>\n          <div class=\"footer\">\n            <p>&copy; " + new Date().getFullYear() + " ResumeYatra. All rights reserved.</p>\n            <p>Building careers, one resume at a time.</p>\n          </div>\n        </div>\n      </body>\n      </html>\n    ";
                    return [4 /*yield*/, sendEmail_1.sendEmail(user.email, "Reset Your Password - ResumeYatra", emailTemplate)];
                case 3:
                    _a.sent();
                    res.json({ message: "Password reset link sent to your email" });
                    return [3 /*break*/, 5];
                case 4:
                    err_4 = _a.sent();
                    console.error("forgot password error:", err_4);
                    res.status(500).json({ error: "Something went wrong" });
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.forgotPassword = forgotPassword;
function resetPassword(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var password, token, hashedToken, user, _a, err_5;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 4, , 5]);
                    password = req.body.password;
                    if (!password || password.length < 6) {
                        return [2 /*return*/, res.status(400).json({ error: "Password must be at least 6 characters" })];
                    }
                    token = req.params.token;
                    hashedToken = crypto_1["default"]
                        .createHash("sha256")
                        .update(token)
                        .digest("hex");
                    return [4 /*yield*/, User_1["default"].findOne({
                            resetPasswordToken: hashedToken,
                            resetPasswordExpires: { $gt: new Date() }
                        })];
                case 1:
                    user = _b.sent();
                    if (!user) {
                        return [2 /*return*/, res.status(400).json({ error: "Token invalid or expired" })];
                    }
                    _a = user;
                    return [4 /*yield*/, authService.hashPassword(password)];
                case 2:
                    _a.password = _b.sent();
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpires = undefined;
                    return [4 /*yield*/, user.save()];
                case 3:
                    _b.sent();
                    res.json({ message: "Password reset successful" });
                    return [3 /*break*/, 5];
                case 4:
                    err_5 = _b.sent();
                    console.error("reset password error:", err_5);
                    res.status(500).json({ error: "Something went wrong" });
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.resetPassword = resetPassword;
function logout(req, res) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            res.clearCookie('token');
            res.json({ message: 'Logged out successfully' });
            return [2 /*return*/];
        });
    });
}
exports.logout = logout;
