import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Protected dashboard routes
router.use(authenticate);

router.get('/stats', DashboardController.getStats);

export default router;
