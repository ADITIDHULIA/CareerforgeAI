import { Router } from 'express';
import { ResumeController } from '../controllers/resume.controller';
import { authenticate } from '../middleware/auth.middleware';
import { uploadResume } from '../middleware/upload.middleware';

const router = Router();

// All resume routes are protected
router.use(authenticate);

router.post('/', uploadResume.single('resume'), ResumeController.upload);
router.get('/', ResumeController.list);
router.get('/:id', ResumeController.getById);
router.delete('/:id', ResumeController.delete);

export default router;
