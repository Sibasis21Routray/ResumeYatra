import { Router } from 'express'
import { register, login, me, forgotPassword, resetPassword, logout } from '../controllers/auth.controller'
import { authMiddleware } from '../middleware/auth.middleware'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.get('/me', authMiddleware, me)

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router
