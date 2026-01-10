import net from 'node:net';
import Modbus from 'jsmodbus';
import { IMeasurement } from '../interfaces/measurement.interface.js';
import { IDeviceConfig } from '../interfaces/device.interface.js';

const DEFAULT_TIMEOUT_MS = 3000;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 500;
const SOCKET_MAX_LISTENERS = 20;
const CLEANUP_INTERVAL_MS = 10000;
const CONNECTION_TTL = 30000;

interface SharedConnection {
    socket: net.Socket;
    clients: Map<number, InstanceType<typeof Modbus.client.TCP>>;
    lastUsed: number;
}

const connectionPool = new Map<string, SharedConnection>();
const requestQueues = new Map<string, Promise<void>>();

function getDeviceKey(device: IDeviceConfig): string {
    return `${device.ip}:${device.port}`;
}

function cleanupConnection(key: string): void {
    const conn = connectionPool.get(key);
    if (conn) {
        try {
            conn.socket.destroy();
        } catch (e) {
            console.error(`Error destroying socket for ${key}:`, e);
        }
        connectionPool.delete(key);
    }
}

function cleanupExpiredConnections(): void {
    const now = Date.now();
    for (const [key, conn] of connectionPool.entries()) {
        if (now - conn.lastUsed > CONNECTION_TTL) {
            cleanupConnection(key);
        }
    }
}

setInterval(cleanupExpiredConnections, CLEANUP_INTERVAL_MS);

async function getOrCreateConnection(device: IDeviceConfig, timeoutMs: number): Promise<InstanceType<typeof Modbus.client.TCP>> {
    const key = getDeviceKey(device);

    let sharedConn = connectionPool.get(key);

    if (sharedConn) {
        if (Date.now() - sharedConn.lastUsed < CONNECTION_TTL && !sharedConn.socket.destroyed) {
            sharedConn.lastUsed = Date.now();
        } else {
            cleanupConnection(key);
            sharedConn = undefined;
        }
    }

    if (!sharedConn) {
        const socket = new net.Socket();
        socket.setMaxListeners(SOCKET_MAX_LISTENERS);

        const newConn: SharedConnection = {
            socket,
            clients: new Map(),
            lastUsed: Date.now()
        };

        socket.on('error', (err) => {
            console.error(`Socket error for ${key}:`, err.message);
            try { socket.destroy(); } catch { }
            connectionPool.delete(key);
        });

        socket.on('close', () => {
            connectionPool.delete(key);
        });

        socket.connect(device.port, device.ip);

        connectionPool.set(key, newConn);
        sharedConn = newConn;
    }

    let client = sharedConn.clients.get(device.unitId);
    if (!client) {
        client = new Modbus.client.TCP(sharedConn.socket, device.unitId, timeoutMs);
        sharedConn.clients.set(device.unitId, client);

        if (sharedConn.socket.readyState === 'open') {
            sharedConn.socket.emit('connect');
        }
    }

    return client;
}

async function withDeviceLock<T>(device: IDeviceConfig, action: () => Promise<T>): Promise<T> {
    const key = getDeviceKey(device);

    const previousTask = requestQueues.get(key) || Promise.resolve();

    const task = async (): Promise<T> => {
        try {
            await previousTask.catch(() => { });
            return await action();
        } finally {
            if (requestQueues.get(key) === resultPromise) {
                requestQueues.delete(key);
            }
        }
    };

    const resultPromise = task();
    requestQueues.set(key, resultPromise.then(() => { }).catch(() => { }));
    return resultPromise;
}

export async function readDevice(
    device: IDeviceConfig,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    retries = MAX_RETRIES
): Promise<IMeasurement> {
    return withDeviceLock(device, async () => {
        let lastError: Error | null = null;

        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                const client = await getOrCreateConnection(device, timeoutMs);
                const result = await client.readInputRegisters(
                    device.start_address,
                    device.num_of_registers
                );

                const key = getDeviceKey(device);
                const sharedConn = connectionPool.get(key);
                if (sharedConn) {
                    sharedConn.lastUsed = Date.now();
                }

                const values = result.response.body.valuesAsArray;

                if (values.length < 2) {
                    throw new Error(`Insufficient data from device ${device.id}: got ${values.length} values`);
                }

                const [reg1, reg2] = values;
                return {
                    sensorId: device.id,
                    ts: new Date(),
                    temperature: reg1 / device.temperature_divisor,
                    humidity: reg2 / device.humidity_divisor,
                };
            } catch (err) {
                lastError = err as Error;

                if (err instanceof Error) {
                    const key = getDeviceKey(device);
                    cleanupConnection(key);
                }

                if (err instanceof Error && err.message.includes('Insufficient data')) {
                    throw err;
                }

                if (attempt < retries) {
                    const delay = RETRY_DELAY_MS * Math.pow(2, attempt);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }
            }
        }

        throw new Error(`Failed to read device ${device.id} after ${retries + 1} attempts: ${lastError?.message}`);
    });
}
