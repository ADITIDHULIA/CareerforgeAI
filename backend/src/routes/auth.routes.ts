import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validate.middleware';
import { registerSchema, loginSchema, updateProfileSchema } from '../schemas/auth.schema';
import { authenticate } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();

router.post('/register', authLimiter, validateRequest(registerSchema), AuthController.register);
router.post('/login', authLimiter, validateRequest(loginSchema), AuthController.login);
router.get('/me', authenticate, AuthController.getMe);
router.put('/profile', authenticate, validateRequest(updateProfileSchema), AuthController.updateProfile);
router.post('/logout', AuthController.logout);

export default router;
