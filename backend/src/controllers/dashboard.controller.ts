import { Request, Response, NextFunction } from 'express';
import { AnalysisService } from '../services/analysis.service';

export class DashboardController {
  public static async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await AnalysisService.getDashboardStats(req.user!.id);
      res.status(200).json({
        status: 'success',
        stats,
      });
    } catch (error) {
      next(error);
    }
  }
}
