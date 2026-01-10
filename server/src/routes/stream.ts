import { Router, type Request, type Response } from 'express';
import { sendToClient } from '../services/broadcaster.js';
import { readDevice } from '../services/modbus.js';
import { config } from '../config/environment.js';
import { prisma } from '../lib/prisma.js';
import { IMeasurement } from '../interfaces/measurement.interface.js';

export const streamRouter = Router();

streamRouter.get('/stream', (req: Request, res: Response): void => {
    res.set({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
    });
    res.flushHeaders();

    const timers = new Set<NodeJS.Timeout>();

    const STAGGER_DELAY_MS = 200;

    const addTimer = (timer: NodeJS.Timeout) => timers.add(timer);
    const removeTimer = (timer: NodeJS.Timeout) => timers.delete(timer);

    config.sensors.forEach(sensor => {
        let busy = false;

        const startTimer = setTimeout(() => {
            removeTimer(startTimer);

            if (res.writableEnded || res.socket?.destroyed) return;

            const interval = setInterval(async () => {
                if (busy || res.writableEnded || res.socket?.destroyed) return;
                busy = true;

                try {
                    const fullDeviceConfig = {
                        ...config.deviceConfig,
                        ...sensor,
                    }

                    const reading = await readDevice(fullDeviceConfig);
                    if (!res.writableEnded && !res.socket?.destroyed) {
                        sendToClient(res, reading);

                        saveMeasurement(reading).catch(err => {
                            console.error(`Database write failed for sensor ${sensor.id}:`, err);
                        });
                    }
                } catch (err: unknown) {
                    if (!res.writableEnded && !res.socket?.destroyed) {
                        const errorMessage = err instanceof Error ? err.message : String(err);
                        console.warn(`Error reading sensor ${sensor.id}:`, errorMessage);

                        sendToClient(res, {
                            sensorId: sensor.id,
                            ts: new Date(),
                            error: errorMessage
                        });
                    }
                } finally {
                    busy = false;
                }
            }, config.deviceConfig.polling_interval_ms);

            addTimer(interval);
        }, STAGGER_DELAY_MS);

        addTimer(startTimer);
    });

    const cleanup = () => {
        timers.forEach(timer => {
            clearTimeout(timer);
            clearInterval(timer);
        });
        timers.clear();
    };

    res.on('close', cleanup);
    res.on('error', cleanup);
});

async function saveMeasurement(data: IMeasurement) {
    await prisma.measurement.create({ data });
}
