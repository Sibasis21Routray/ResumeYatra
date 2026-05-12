"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAdmin = seedAdmin;
const User_1 = __importDefault(require("../models/User"));
const auth_service_1 = require("../services/auth.service");
async function seedAdmin() {
    try {
        console.log('Seeding admin...');
        const existingAdmin = await User_1.default.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log('Admin user already exists');
            return;
        }
        const hashedPassword = await (0, auth_service_1.hashPassword)('admin123');
        await User_1.default.create({
            email: 'admin@example.com',
            name: 'Admin',
            password: hashedPassword,
            role: 'admin'
        });
        console.log('Admin created successfully');
    }
    catch (error) {
        console.error('Error seeding admin:', error);
    }
}
seedAdmin();
