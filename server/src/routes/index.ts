import { Router } from 'express';
import { statsRouter } from './stats.js';
import { streamRouter } from './stream.js';
import { healthRouter } from './health.js';

export const routes = Router();
routes.use(statsRouter);
routes.use(streamRouter);
routes.use(healthRouter);
