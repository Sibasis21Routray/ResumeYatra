import { Router } from 'express'
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware'
import User from '../models/User'
import Resume from '../models/Resume'
import TokenUsage from '../models/TokenUsage'
import Invoice from '../models/Invoice'
import { updatePricing, updateAdminSignature } from '../controllers/pricing.controller'
import { uploadMiddleware } from '../middleware/upload.middleware'

const router = Router()

// Apply admin middleware to all admin routes
// authMiddleware is already applied in the main routes/index.ts
router.use(adminMiddleware)

router.get('/ping', (req, res) => res.json({ message: 'admin pond ok' }))

// Get detailed token usage logs
router.get('/token-usage', async (req, res) => {
  try {
    const usageLogs = await TokenUsage.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(1000); // Limit to last 1000 requests for performance

    const formattedLogs = usageLogs.map(log => {
      const user = log.userId as any;
      
      // Categorize action
      let category = 'AI Enhancement';
      if (log.action.includes('parsing') || log.action.includes('extract')) {
        category = 'Parsing';
      }

      return {
        id: log._id,
        userId: user?._id || log.guestId || 'N/A',
        userName: user?.name || (log.guestId ? `Guest (${log.guestId.substring(0, 8)})` : 'Unknown'),
        userEmail: user?.email || (log.guestId ? 'Guest User' : 'N/A'),
        inputTokens: log.promptTokens,
        outputTokens: log.completionTokens,
        totalTokens: log.totalTokens,
        category: category,
        action: log.action,
        model: log.aiModel,
        date: log.createdAt
      };
    });

    res.json(formattedLogs);
  } catch (error) {
    console.error('Error fetching token usage logs:', error);
    res.status(500).json({ error: 'Failed to fetch token usage logs' });
  }
});

// Get all users with resume count
router.get('/users', async (req, res) => {
  try {
    const users = await User.aggregate([
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
          subscriptionPlan: 1,
          subscriptionExpiry: 1,
          createdAt: 1,
          _count: {
            resumes: { $size: '$resumes' }
          }
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ])

    // Convert _id to id for frontend compatibility
    const formattedUsers = users.map(user => ({
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      subscriptionPlan: user.subscriptionPlan,
      subscriptionExpiry: user.subscriptionExpiry,
      createdAt: user.createdAt,
      _count: user._count
    }))

    res.json(formattedUsers)
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

// Get all resumes with owner info
router.get('/resumes', async (req, res) => {
  try {
    const resumes = await Resume.aggregate([
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
           isParsed: 1,
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
    ])

    // Convert _id to id for frontend compatibility
    const formattedResumes = resumes.map(resume => ({
      id: resume._id.toString(),
      title: resume.title,
      template: resume.template,
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt,
      isParsed: resume.isParsed,
      owner: {
        id: resume.owner.id.toString(),
        email: resume.owner.email,
        name: resume.owner.name
      }
    }))

    res.json(formattedResumes)
  } catch (error) {
    console.error('Error fetching resumes:', error)
    res.status(500).json({ error: 'Failed to fetch resumes' })
  }
})

// Get stats
router.get('/stats', async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      userCount, 
      resumeCount, 
      activeSubsCount,
      freelancerCount,
      candidateCount,
      revenueResult,
      aiUsageResult
    ] = await Promise.all([
      User.countDocuments(),
      Resume.countDocuments(),
      User.countDocuments({ subscriptionPlan: { $ne: 'none' }, subscriptionExpiry: { $gt: now } }),
      User.countDocuments({ subscriptionPlan: 'freelancer', subscriptionExpiry: { $gt: now } }),
      User.countDocuments({ subscriptionPlan: 'candidate', subscriptionExpiry: { $gt: now } }),
      Invoice.aggregate([
        { $match: { status: 'paid', createdAt: { $gt: thirtyDaysAgo } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      TokenUsage.aggregate([
        { $group: { _id: null, total: { $sum: '$totalTokens' } } }
      ])
    ])

    const templateResult = await Resume.distinct('template')
    const templateCount = templateResult.length

    res.json({
      users: userCount,
      resumes: resumeCount,
      templates: templateCount,
      activeSubscriptions: activeSubsCount,
      freelancerCount: freelancerCount,
      candidateCount: candidateCount,
      revenue: (revenueResult[0]?.total || 0) / 100, // Convert from cents if needed? Wait, I should check if amount is in paise/cents.
      aiCreditsUsed: aiUsageResult[0]?.total || 0,
      totalAiEnhancements: await TokenUsage.countDocuments({ action: { $in: ['enhanceResume', 'enhanceSkillsWithAI'] } }),
      aiAdoptionRate: userCount > 0 ? Math.round((await TokenUsage.distinct('userId')).length / userCount * 100) : 0
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
})

// Update pricing
router.put('/pricing', updatePricing)

// Upload admin signature
router.post('/settings/signature', uploadMiddleware, updateAdminSignature)

// Delete user
router.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id

    // Check if user exists
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Don't allow deleting admin users
    if (user.role === 'admin') {
      return res.status(403).json({ error: 'Cannot delete admin user' })
    }

    // Delete user's resumes first
    await Resume.deleteMany({ ownerId: userId })

    // Delete user
    await User.findByIdAndDelete(userId)

    res.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Error deleting user:', error)
    res.status(500).json({ error: 'Failed to delete user' })
  }
})

// Delete resume
router.delete('/resumes/:id', async (req, res) => {
  try {
    const resumeId = req.params.id

    const resume = await Resume.findById(resumeId)
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' })
    }

    await Resume.findByIdAndDelete(resumeId)

    res.json({ message: 'Resume deleted successfully' })
  } catch (error) {
    console.error('Error deleting resume:', error)
    res.status(500).json({ error: 'Failed to delete resume' })
  }
})

// Get user's resumes
router.get('/user/:userId/resumes', async (req, res) => {
  try {
    const userId = req.params.userId

    const resumes = await Resume.find({ ownerId: userId })
      .select('title template createdAt updatedAt')
      .sort({ updatedAt: -1 })

    // Convert _id to id for frontend compatibility
    const formattedResumes = resumes.map(resume => ({
      id: resume._id.toString(),
      title: resume.title,
      template: resume.template,
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt
    }))

    res.json(formattedResumes)
  } catch (error) {
    console.error('Error fetching user resumes:', error)
    res.status(500).json({ error: 'Failed to fetch user resumes' })
  }
})

// Get single resume with full details including versions
router.get('/resumes/:id', async (req, res) => {
  try {
    const resumeId = req.params.id;

    const resume = await Resume.findById(resumeId)
      .populate('ownerId', 'name email')
      .populate('versions');

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // Format the response
    const formattedResume = {
      id: resume._id.toString(),
      title: resume.title,
      template: resume.template,
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt,
      isParsed: (resume as any).isParsed, 
      owner: resume.ownerId ? {
        id: resume.ownerId._id.toString(),
        name: (resume.ownerId as any).name,
        email: (resume.ownerId as any).email
      } : null,
      versions: resume.versions ? resume.versions.map((version: any) => ({
        id: version._id.toString(),
        data: version.data,
        createdAt: version.createdAt,
        updatedAt: version.updatedAt
      })) : []
    };

    res.json(formattedResume);
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({ error: 'Failed to fetch resume' });
  }
});


export default router