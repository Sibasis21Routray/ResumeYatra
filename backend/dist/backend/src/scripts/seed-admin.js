"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const db_1 = __importDefault(require("../db/db"));
const User_1 = __importDefault(require("../models/User"));
const auth_service_1 = require("../services/auth.service");
async function seedAdmin() {
    try {
        await (0, db_1.default)();
        console.log('Connected to database');
        // Check if admin already exists
        const existingAdmin = await User_1.default.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log('Admin user already exists');
            return;
        }
        // Create default admin user
        const adminEmail = 'admin@example.com';
        const adminPassword = 'admin123'; // Change this to a secure password
        const adminName = 'Admin';
        const hashedPassword = await (0, auth_service_1.hashPassword)(adminPassword);
        const adminUser = new User_1.default({
            email: adminEmail,
            name: adminName,
            password: hashedPassword,
            role: 'admin'
        });
        await adminUser.save();
        console.log('Default admin user created successfully');
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);
        console.log('Please change the password after first login');
    }
    catch (error) {
        console.error('Error seeding admin:', error);
        process.exitCode = 1;
    }
    finally {
        // Close the connection
        await mongoose_1.default.connection.close();
        console.log('Database connection closed');
    }
}
seedAdmin();
