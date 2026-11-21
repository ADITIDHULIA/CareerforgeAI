import dotenv from 'dotenv';
import path from 'path';

// Load .env from backend directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/careerforge_db?schema=public',
  jwtSecret: process.env.JWT_SECRET || 'careerforge-super-secret-jwt-key-replace-in-production-2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  uploadDir: path.resolve(__dirname, '../../uploads'),
  maxFileSize: 5 * 1024 * 1024, // 5MB
};
