import { Router, type Request, type Response } from 'express';
import { prisma } from '../utils/prisma.js';

export const healthRouter = Router();

healthRouter.get('/', (_req: Request, res: Response): void => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

healthRouter.get(
  '/ready',
  async (_req: Request, res: Response): Promise<void> => {
    try {
      // Check database connection
      await prisma.$queryRaw`SELECT 1`;

      res.json({
        status: 'ready',
        timestamp: new Date().toISOString(),
        checks: {
          database: 'ok',
        },
      });
    } catch {
      res.status(503).json({
        status: 'not_ready',
        timestamp: new Date().toISOString(),
        checks: {
          database: 'error',
        },
      });
    }
  }
);
