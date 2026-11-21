import fs from 'fs';
import path from 'path';
import { prisma } from '../utils/prisma';
import { TextExtractorService } from './textExtractor.service';
import { AppError } from '../middleware/error.middleware';
import { logger } from '../utils/logger';

export class ResumeService {
  public static async uploadAndProcessResume(
    userId: string,
    file: Express.Multer.File
  ) {
    try {
      const ext = path.extname(file.originalname).toLowerCase();
      const fileType = ext === '.pdf' ? 'pdf' : 'docx';

      // Extract readable text from the uploaded document
      const parsedText = await TextExtractorService.extractText(file.path, file.mimetype);

      // Extract identified technical skills from text
      const extractedSkills = TextExtractorService.extractSkills(parsedText);

      // Save record in database
      const resume = await prisma.resume.create({
        data: {
          userId,
          fileName: file.originalname,
          fileUrl: file.filename,
          fileSize: file.size,
          fileType,
          parsedText,
          extractedSkills,
        },
      });

      return resume;
    } catch (error) {
      // Remove the file if text extraction or database creation fails
      if (fs.existsSync(file.path)) {
        try {
          await fs.promises.unlink(file.path);
        } catch (cleanupError) {
          logger.warn(`Failed to clean up uploaded file: ${file.path}`);
        }
      }
      throw error;
    }
  }

  public static async getUserResumes(userId: string) {
    return prisma.resume.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        userId: true,
        fileName: true,
        fileSize: true,
        fileType: true,
        parsedText: true,
        extractedSkills: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  public static async getResumeById(resumeId: string, userId: string) {
    const resume = await prisma.resume.findUnique({
      where: { id: resumeId },
    });

    if (!resume) {
      const error: AppError = new Error('Resume not found.');
      error.statusCode = 404;
      throw error;
    }

    if (resume.userId !== userId) {
      const error: AppError = new Error('Access denied. You do not have permission to view this resume.');
      error.statusCode = 403;
      throw error;
    }

    return resume;
  }

  public static async deleteResume(resumeId: string, userId: string) {
    const resume = await prisma.resume.findUnique({
      where: { id: resumeId },
    });

    if (!resume) {
      const error: AppError = new Error('Resume not found.');
      error.statusCode = 404;
      throw error;
    }

    if (resume.userId !== userId) {
      const error: AppError = new Error('Access denied. You do not have permission to delete this resume.');
      error.statusCode = 403;
      throw error;
    }

    // Delete record from database
    await prisma.resume.delete({
      where: { id: resumeId },
    });

    // Delete associated physical file from disk
    const filePath = path.resolve(__dirname, '../../uploads', resume.fileUrl);
    if (fs.existsSync(filePath)) {
      try {
        await fs.promises.unlink(filePath);
      } catch (fileError: any) {
        logger.warn(`Could not delete file from disk: ${filePath} - ${fileError.message}`);
      }
    }

    return { success: true, message: 'Resume deleted successfully.' };
  }
}
