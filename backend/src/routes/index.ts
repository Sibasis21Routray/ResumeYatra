import { Router } from 'express'
import auth from './auth'
import resumes from './resumes'
import admin from './admin'
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth.middleware'
import templates from './templates'
import payment from './payment'

const router = Router()

router.use('/auth', auth)
// Public templates preview (no auth required)
router.use('/templates', templates)
router.use('/resumes',optionalAuthMiddleware, resumes)
router.use('/admin', authMiddleware, admin)
router.use("/payment", optionalAuthMiddleware, payment);

export default router


