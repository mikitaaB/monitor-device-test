import { request } from './request';

interface Measurement {
    ts: string;
    sensorId: number;
    temperature: number;
    humidity: number;
}

interface StatsParams {
    from: string;
    to: string;
}

export const getStatsAPI = async ({ from, to }: StatsParams) => {
    const response = await request<Measurement[]>({
        url: '/stats',
        params: {
            from,
            to,
        },
    });
    return response.data;
};
