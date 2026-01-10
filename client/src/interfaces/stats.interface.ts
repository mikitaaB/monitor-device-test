export type RangeOption = '1h' | '6h' | '24h' | 'day';

export interface Measurement {
    ts: string;
    sensorId: number;
    temperature: number;
    humidity: number;
}