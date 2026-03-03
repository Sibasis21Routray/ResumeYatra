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
exports.register = register;
exports.login = login;
exports.me = me;
const authService = __importStar(require("../services/auth.service"));
async function register(req, res) {
    try {
        const { email, name, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ error: 'email and password required' });
        const result = await authService.register(email, name || 'User', password);
        res.status(201).json(result);
    }
    catch (err) {
        console.error('register error:', err);
        res.status(400).json({ error: err.message || 'registration failed' });
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
        res.json({ id: user.id, email: user.email, name: user.name });
    }
    catch (err) {
        console.error('me error:', err);
        res.status(500).json({ error: err.message || 'internal error' });
    }
}
