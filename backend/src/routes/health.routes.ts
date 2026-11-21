import { Router, Request, Response } from 'express';
import { prisma } from '../utils/prisma';

const router = Router();

router.get('/health', async (_req: Request, res: Response) => {
  let dbStatus = 'healthy';
  try {
    // Quick probe to database
    await prisma.$queryRaw`SELECT 1`;
  } catch (err: any) {
    dbStatus = `degraded: ${err.message}`;
  }

  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'CareerForge AI Backend',
    database: dbStatus,
  });
});

export default router;
