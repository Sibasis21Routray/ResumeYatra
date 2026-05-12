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
async function register(email, name, password) {
    // Check if user already exists
    const existingUser = await User_1.default.findOne({ email });
    if (existingUser)
        throw new Error('User already exists');
    const hashedPassword = await hashPassword(password);
    const user = new User_1.default({ email, name, password: hashedPassword });
    await user.save();
    const token = generateToken(user._id.toString());
    return { user: { id: user._id.toString(), email: user.email, name: user.name, role: user.role }, token };
}
async function login(email, password) {
    const user = await User_1.default.findOne({ email });
    if (!user)
        throw new Error('Invalid credentials');
    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch)
        throw new Error('Invalid credentials');
    const token = generateToken(user._id.toString());
    return { user: { id: user._id.toString(), email: user.email, name: user.name, role: user.role }, token };
}
async function getUserById(userId) {
    return User_1.default.findById(userId);
}
