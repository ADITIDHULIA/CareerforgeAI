import { prisma } from '../utils/prisma';
import { GeminiService } from './gemini.service';
import { CreateAnalysisInput } from '../schemas/analysis.schema';
import { AppError } from '../middleware/error.middleware';

export class AnalysisService {
  public static async createAnalysis(userId: string, input: CreateAnalysisInput) {
    // 1. Verify that the resume belongs to this authenticated user
    const resume = await prisma.resume.findUnique({
      where: { id: input.resumeId },
    });

    if (!resume) {
      const error: AppError = new Error('Selected resume not found.');
      error.statusCode = 404;
      throw error;
    }

    if (resume.userId !== userId) {
      const error: AppError = new Error('Access denied. You do not own this resume.');
      error.statusCode = 403;
      throw error;
    }

    // 2. Perform AI analysis using Gemini
    const result = await GeminiService.analyzeResume(
      resume.parsedText,
      input.jobTitle,
      input.jobDescription,
      input.company
    );

    // 3. Save report to the database
    const report = await prisma.analysisReport.create({
      data: {
        userId,
        resumeId: resume.id,
        jobTitle: input.jobTitle,
        company: input.company || null,
        jobDescription: input.jobDescription,
        matchScore: result.matchScore,
        summary: result.summary,
        matchingSkills: result.matchingSkills,
        missingSkills: result.missingSkills,
        strengths: result.strengths,
        improvements: result.improvements,
        interviewQuestions: result.interviewQuestions as any,
        learningPriorities: result.learningPriorities as any,
      },
      include: {
        resume: {
          select: {
            id: true,
            fileName: true,
          },
        },
      },
    });

    return report;
  }

  public static async getUserAnalyses(userId: string) {
    return prisma.analysisReport.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        resume: {
          select: {
            id: true,
            fileName: true,
          },
        },
      },
    });
  }

  public static async getAnalysisById(reportId: string, userId: string) {
    const report = await prisma.analysisReport.findUnique({
      where: { id: reportId },
      include: {
        resume: {
          select: {
            id: true,
            fileName: true,
          },
        },
      },
    });

    if (!report) {
      const error: AppError = new Error('Analysis report not found.');
      error.statusCode = 404;
      throw error;
    }

    if (report.userId !== userId) {
      const error: AppError = new Error('Access denied. You do not own this report.');
      error.statusCode = 403;
      throw error;
    }

    return report;
  }

  public static async deleteAnalysis(reportId: string, userId: string) {
    const report = await prisma.analysisReport.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      const error: AppError = new Error('Analysis report not found.');
      error.statusCode = 404;
      throw error;
    }

    if (report.userId !== userId) {
      const error: AppError = new Error('Access denied. You do not have permission to delete this report.');
      error.statusCode = 403;
      throw error;
    }

    await prisma.analysisReport.delete({
      where: { id: reportId },
    });

    return { success: true, message: 'Report deleted successfully.' };
  }

  public static async getDashboardStats(userId: string) {
    const [reports, totalResumes] = await Promise.all([
      prisma.analysisReport.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.resume.count({
        where: { userId },
      }),
    ]);

    const totalAnalyses = reports.length;
    const averageScore =
      totalAnalyses > 0
        ? Math.round(reports.reduce((acc, r) => acc + r.matchScore, 0) / totalAnalyses)
        : 0;

    // Count frequency of missing skills across user reports
    const skillCountMap = new Map<string, number>();
    reports.forEach((r) => {
      r.missingSkills.forEach((skill) => {
        const normalized = skill.trim();
        skillCountMap.set(normalized, (skillCountMap.get(normalized) || 0) + 1);
      });
    });

    const topMissingSkills = Array.from(skillCountMap.entries())
      .map(([skill, count]) => ({ skill, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // Score distribution buckets
    const scoreDistribution = [
      { range: '80-100% (High)', count: reports.filter((r) => r.matchScore >= 80).length },
      { range: '60-79% (Medium)', count: reports.filter((r) => r.matchScore >= 60 && r.matchScore < 80).length },
      { range: '0-59% (Low)', count: reports.filter((r) => r.matchScore < 60).length },
    ];

    const recentAnalyses = reports.slice(0, 5).map((r) => ({
      id: r.id,
      jobTitle: r.jobTitle,
      company: r.company,
      matchScore: r.matchScore,
      createdAt: r.createdAt.toISOString(),
    }));

    return {
      totalAnalyses,
      averageScore,
      totalResumes,
      topMissingSkills,
      scoreDistribution,
      recentAnalyses,
    };
  }
}
