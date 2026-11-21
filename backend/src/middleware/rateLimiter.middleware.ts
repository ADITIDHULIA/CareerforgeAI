import rateLimit from 'express-rate-limit';

// Standard rate limiter for general API requests: 200 requests per 15 minutes
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Too many requests from this IP address, please try again in 15 minutes.',
  },
});

// Stricter rate limiter for authentication routes: 15 attempts per 15 minutes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Too many authentication attempts, please try again after 15 minutes.',
  },
});

// Stricter rate limiter for AI analyses to prevent abuse: 20 analyses per 10 minutes
export const analysisLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'error',
    message: 'Analysis limit reached. Please wait a few minutes before submitting another job analysis.',
  },
});
