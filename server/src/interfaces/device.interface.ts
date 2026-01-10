export interface IDeviceConfig {
    id: number;
    ip: string;
    port: number;
    unitId: number;
    start_address: number;
    num_of_registers: number;
    temperature_divisor: number;
    humidity_divisor: number;
    polling_interval_ms: number;
}
