import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long').max(100),
  email: z.string().email('Please provide a valid email address').toLowerCase().trim(),
  password: z.string().min(6, 'Password must be at least 6 characters long').max(128),
  targetRole: z.string().max(100).optional(),
  targetCompany: z.string().max(100).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Please provide a valid email address').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long').max(100).optional(),
  targetRole: z.string().max(100).nullable().optional(),
  targetCompany: z.string().max(100).nullable().optional(),
  bio: z.string().max(500).nullable().optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(6, 'New password must be at least 6 characters long').optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
