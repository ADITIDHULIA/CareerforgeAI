import { Router } from 'express';
import { AnalysisController } from '../controllers/analysis.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateRequest } from '../middleware/validate.middleware';
import { createAnalysisSchema } from '../schemas/analysis.schema';
import { analysisLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();

// All analysis routes are protected
router.use(authenticate);

router.post('/', analysisLimiter, validateRequest(createAnalysisSchema), AnalysisController.create);
router.get('/', AnalysisController.list);
router.get('/:id', AnalysisController.getById);
router.delete('/:id', AnalysisController.delete);

export default router;
