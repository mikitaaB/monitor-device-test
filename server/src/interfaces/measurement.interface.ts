export interface IMeasurement {
    sensorId: number;
    ts: Date;
    temperature: number;
    humidity: number;
}

export interface ISseEvent {
    sensorId: number;
    ts: Date;
    temperature?: number;
    humidity?: number;
    error?: string;
}

export type ISseMeasurement = IMeasurement | (Omit<ISseEvent, 'temperature' | 'humidity'> & { error: string });
