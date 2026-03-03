import { Router } from 'express'
import auth from './auth'
import resumes from './resumes'
import admin from './admin'
import { authMiddleware } from '../middleware/auth.middleware'
import templates from './templates'

const router = Router()

router.use('/auth', auth)
// Public templates preview (no auth required)
router.use('/templates', templates)
router.use('/resumes', authMiddleware, resumes)
router.use('/admin', authMiddleware, admin)

export default router
