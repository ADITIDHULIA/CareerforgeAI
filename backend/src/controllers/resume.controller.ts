import { Request, Response, NextFunction } from 'express';
import { ResumeService } from '../services/resume.service';

export class ResumeController {
  public static async upload(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({
          status: 'error',
          message: 'Please upload a resume file (PDF or DOCX).',
        });
        return;
      }

      const resume = await ResumeService.uploadAndProcessResume(req.user!.id, req.file);

      res.status(201).json({
        status: 'success',
        message: 'Resume uploaded and parsed successfully.',
        resume,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const resumes = await ResumeService.getUserResumes(req.user!.id);
      res.status(200).json({
        status: 'success',
        resumes,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const resume = await ResumeService.getResumeById(id, req.user!.id);
      res.status(200).json({
        status: 'success',
        resume,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const result = await ResumeService.deleteResume(id, req.user!.id);
      res.status(200).json({
        status: 'success',
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }
}
