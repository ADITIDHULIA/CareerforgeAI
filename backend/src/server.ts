import app from './app';
import { config } from './config/env';
import { logger } from './utils/logger';
import { prisma } from './utils/prisma';

const startServer = async () => {
  try {
    // Verify database connection
    await prisma.$connect();
    logger.info('Connected to PostgreSQL database successfully.');

    const server = app.listen(config.port, () => {
      logger.info(`CareerForge AI backend server running on port ${config.port} [${config.env}]`);
      logger.info(`Health check available at http://localhost:${config.port}/api/health`);
    });

    const shutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        await prisma.$disconnect();
        logger.info('Database connection closed. Process exited.');
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error: any) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
