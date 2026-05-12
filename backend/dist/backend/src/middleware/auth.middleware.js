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
exports.authMiddleware = authMiddleware;
exports.adminMiddleware = adminMiddleware;
const authService = __importStar(require("../services/auth.service"));
const User_1 = __importDefault(require("../models/User"));
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    console.log('[Auth] Authorization header:', authHeader ? 'Present' : 'Missing');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('[Auth] Missing or invalid authorization header');
        return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }
    const token = authHeader.substring(7);
    console.log('[Auth] Token extracted, length:', token.length);
    const decoded = authService.verifyToken(token);
    console.log('[Auth] Token verification result:', decoded ? 'Success' : 'Failed');
    if (!decoded) {
        console.log('[Auth] Invalid or expired token');
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
    req.userId = decoded.userId;
    console.log('[Auth] User ID set:', req.userId);
    next();
}
async function adminMiddleware(req, res, next) {
    if (!req.userId) {
        console.log('[Admin] No user ID found, auth middleware must be called first');
        return res.status(401).json({ error: 'Authentication required' });
    }
    try {
        const user = await User_1.default.findById(req.userId);
        if (!user) {
            console.log('[Admin] User not found:', req.userId);
            return res.status(404).json({ error: 'User not found' });
        }
        if (user.role !== 'admin') {
            console.log('[Admin] User is not admin:', user.role);
            return res.status(403).json({ error: 'Admin access required' });
        }
        console.log('[Admin] Admin access granted for user:', req.userId);
        next();
    }
    catch (error) {
        console.error('[Admin] Error checking admin role:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
