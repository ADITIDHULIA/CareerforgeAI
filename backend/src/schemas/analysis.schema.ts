import { z } from 'zod';

export const createAnalysisSchema = z.object({
  resumeId: z.string().uuid('A valid resume ID is required'),
  jobTitle: z.string().min(2, 'Job title must be at least 2 characters long').max(150),
  company: z.string().max(100).optional(),
  jobDescription: z
    .string()
    .min(30, 'Job description must be at least 30 characters long to provide a quality analysis')
    .max(20000, 'Job description is too long (maximum 20,000 characters)'),
});

export type CreateAnalysisInput = z.infer<typeof createAnalysisSchema>;
