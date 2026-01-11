import { Router, type Request, type Response } from 'express';
import prisma from '../lib/prisma.js';

export const statsRouter = Router();

statsRouter.get('/stats', async (req: Request, res: Response): Promise<void> => {
    const { from, to } = req.query;

    const oneHour = 60 * 60 * 1000;
    const toDate = to ? new Date(to as string) : new Date();
    const fromDate = from ? new Date(from as string) : new Date(toDate.getTime() - oneHour);

    try {
        const data = await prisma.measurement.findMany({
            where: {
                ts: {
                    gte: fromDate,
                    lte: toDate,
                },
            },
            orderBy: { ts: 'asc' },
        });

        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
