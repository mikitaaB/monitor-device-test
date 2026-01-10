import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '../../../.env');
const dotenvResult = dotenv.config({ path: envPath });
dotenvExpand.expand(dotenvResult);

export const config = {
    port: Number(process.env['API_PORT'] || '3000'),
    databaseUrl: process.env['DATABASE_URL']
        || 'postgresql://postgres:postgres@localhost:5432/monitor_db?schema=public',

    deviceConfig: {
        ip: process.env['DEVICE_IP'] ?? '127.0.0.1',
        port: Number(process.env['DEVICE_PORT']) || 502,
        start_address: Number(process.env['DEVICE_START_ADDRESS']) || 1,
        num_of_registers: Number(process.env['DEVICE_NUM_OF_REGISTERS']) || 2,
        polling_interval_ms: Number(process.env['DEVICE_POLLING_INTERVAL_MS']) || 1000,
        temperature_divisor: Number(process.env['DEVICE_TEMPERATURE_DIVISOR']) || 10,
        humidity_divisor: Number(process.env['DEVICE_HUMIDITY_DIVISOR']) || 10,
    },

    sensors: [
        {
            id: 1,
            unitId: Number(process.env['DEVICE_SLAVE_ID_1']) || 1,
        },
        {
            id: 2,
            unitId: Number(process.env['DEVICE_SLAVE_ID_2']) || 2,
        }
    ],
} as const;

