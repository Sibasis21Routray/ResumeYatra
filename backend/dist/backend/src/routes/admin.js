"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const User_1 = __importDefault(require("../models/User"));
const Resume_1 = __importDefault(require("../models/Resume"));
const router = (0, express_1.Router)();
// Apply auth and admin middleware to all admin routes
router.use(auth_middleware_1.authMiddleware);
router.use(auth_middleware_1.adminMiddleware);
// Get all users with resume count
router.get('/users', async (req, res) => {
    try {
        const users = await User_1.default.aggregate([
            {
                $lookup: {
                    from: 'resumes',
                    localField: '_id',
                    foreignField: 'ownerId',
                    as: 'resumes'
                }
            },
            {
                $project: {
                    _id: 1,
                    email: 1,
                    name: 1,
                    role: 1,
                    createdAt: 1,
                    _count: {
                        resumes: { $size: '$resumes' }
                    }
                }
            },
            {
                $sort: { createdAt: -1 }
            }
        ]);
        // Convert _id to id for frontend compatibility
        const formattedUsers = users.map(user => ({
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            createdAt: user.createdAt,
            _count: user._count
        }));
        res.json(formattedUsers);
    }
    catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});
// Get all resumes with owner info
router.get('/resumes', async (req, res) => {
    try {
        const resumes = await Resume_1.default.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'ownerId',
                    foreignField: '_id',
                    as: 'owner'
                }
            },
            {
                $unwind: '$owner'
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    template: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    owner: {
                        id: '$owner._id',
                        email: '$owner.email',
                        name: '$owner.name'
                    }
                }
            },
            {
                $sort: { updatedAt: -1 }
            }
        ]);
        // Convert _id to id for frontend compatibility
        const formattedResumes = resumes.map(resume => ({
            id: resume._id.toString(),
            title: resume.title,
            template: resume.template,
            createdAt: resume.createdAt,
            updatedAt: resume.updatedAt,
            owner: {
                id: resume.owner.id.toString(),
                email: resume.owner.email,
                name: resume.owner.name
            }
        }));
        res.json(formattedResumes);
    }
    catch (error) {
        console.error('Error fetching resumes:', error);
        res.status(500).json({ error: 'Failed to fetch resumes' });
    }
});
// Get stats
router.get('/stats', async (req, res) => {
    try {
        const [userCount, resumeCount] = await Promise.all([
            User_1.default.countDocuments(),
            Resume_1.default.countDocuments()
        ]);
        // For templates, we can count unique templates used in resumes
        const templateResult = await Resume_1.default.distinct('template');
        const templateCount = templateResult.length;
        res.json({
            users: userCount,
            resumes: resumeCount,
            templates: templateCount
        });
    }
    catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});
// Delete user
router.delete('/users/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        // Check if user exists
        const user = await User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // Don't allow deleting admin users
        if (user.role === 'admin') {
            return res.status(403).json({ error: 'Cannot delete admin user' });
        }
        // Delete user's resumes first
        await Resume_1.default.deleteMany({ ownerId: userId });
        // Delete user
        await User_1.default.findByIdAndDelete(userId);
        res.json({ message: 'User deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});
// Delete resume
router.delete('/resumes/:id', async (req, res) => {
    try {
        const resumeId = req.params.id;
        const resume = await Resume_1.default.findById(resumeId);
        if (!resume) {
            return res.status(404).json({ error: 'Resume not found' });
        }
        await Resume_1.default.findByIdAndDelete(resumeId);
        res.json({ message: 'Resume deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting resume:', error);
        res.status(500).json({ error: 'Failed to delete resume' });
    }
});
// Get user's resumes
router.get('/user/:userId/resumes', async (req, res) => {
    try {
        const userId = req.params.userId;
        const resumes = await Resume_1.default.find({ ownerId: userId })
            .select('title template createdAt updatedAt')
            .sort({ updatedAt: -1 });
        // Convert _id to id for frontend compatibility
        const formattedResumes = resumes.map(resume => ({
            id: resume._id.toString(),
            title: resume.title,
            template: resume.template,
            createdAt: resume.createdAt,
            updatedAt: resume.updatedAt
        }));
        res.json(formattedResumes);
    }
    catch (error) {
        console.error('Error fetching user resumes:', error);
        res.status(500).json({ error: 'Failed to fetch user resumes' });
    }
});
exports.default = router;
