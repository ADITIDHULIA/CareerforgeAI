import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/env';
import { apiLimiter } from './middleware/rateLimiter.middleware';
import { errorHandler } from './middleware/error.middleware';

import healthRoutes from './routes/health.routes';
import authRoutes from './routes/auth.routes';
import resumeRoutes from './routes/resume.routes';
import analysisRoutes from './routes/analysis.routes';
import dashboardRoutes from './routes/dashboard.routes';

const app: Application = express();

// Security headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (such as mobile apps or curl) or matching origins
      if (!origin || origin === config.corsOrigin || origin.startsWith('http://localhost:')) {
        callback(null, true);
      } else {
        callback(new Error('Blocked by CORS policy'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global API rate limiter
app.use('/api', apiLimiter);

// Mount API routes
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/analyses', analysisRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Handle unknown API routes
app.use('/api/*', (req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: `API endpoint ${req.method} ${req.originalUrl} not found.`,
  });
});

// Centralized error handler
app.use(errorHandler);

export default app;
