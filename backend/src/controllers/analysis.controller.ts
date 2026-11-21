import { Request, Response, NextFunction } from 'express';
import { AnalysisService } from '../services/analysis.service';

export class AnalysisController {
  public static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const report = await AnalysisService.createAnalysis(req.user!.id, req.body);
      res.status(201).json({
        status: 'success',
        message: 'Resume analyzed successfully.',
        report,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const reports = await AnalysisService.getUserAnalyses(req.user!.id);
      res.status(200).json({
        status: 'success',
        reports,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const report = await AnalysisService.getAnalysisById(id, req.user!.id);
      res.status(200).json({
        status: 'success',
        report,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const result = await AnalysisService.deleteAnalysis(id, req.user!.id);
      res.status(200).json({
        status: 'success',
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}
