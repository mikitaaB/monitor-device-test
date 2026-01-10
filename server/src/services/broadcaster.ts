import { type Response } from 'express';
import { IMeasurement, ISseEvent } from '../interfaces/measurement.interface.js';

export function sendToClient(res: Response, event: IMeasurement | ISseEvent): void {
    res.write(`event: reading\n`);
    res.write(`data: ${JSON.stringify(event)}\n\n`);
}
