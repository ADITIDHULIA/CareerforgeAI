import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { ZodError } from 'zod';
import { logger } from '../utils/logger';

export interface AppError extends Error {
  statusCode?: number;
  errors?: any;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error(`[${req.method}] ${req.originalUrl} - Error: ${err.message}`, {
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
  });

  // Handle Multer upload errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({
        status: 'error',
        message: 'File size limit exceeded. Maximum file size allowed is 5MB.',
      });
      return;
    }
    res.status(400).json({
      status: 'error',
      message: `File upload error: ${err.message}`,
    });
    return;
  }

  // Handle document format / parsing user errors
  if (
    err.message &&
    (err.message.includes('Invalid file type') ||
      err.message.includes('Invalid document format') ||
      err.message.includes('Document contains no readable text') ||
      err.message.includes('bad XRef entry') ||
      err.message.includes('Unsupported document extension'))
  ) {
    res.status(400).json({
      status: 'error',
      message: err.message,
    });
    return;
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: formattedErrors,
    });
    return;
  }

  // Handle JSON parsing errors
  if ('type' in err && err.type === 'entity.parse.failed') {
    res.status(400).json({
      status: 'error',
      message: 'Invalid JSON payload received in request body.',
    });
    return;
  }

  // Handle explicit status codes
  const statusCode = err.statusCode || 500;
  const message =
    statusCode === 500 && process.env.NODE_ENV === 'production'
      ? 'An internal server error occurred. Please try again later.'
      : err.message || 'An unexpected error occurred';

  res.status(statusCode).json({
    status: 'error',
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};
