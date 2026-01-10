import { Router, type Request, type Response } from 'express';

export const healthRouter = Router();

healthRouter.get('/health', (req: Request, res: Response): void => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});
