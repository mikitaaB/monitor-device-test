import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    CartesianGrid,
} from 'recharts';
import type { Measurement } from '../../interfaces/stats.interface';
import { Typography } from '@mui/material';

const COLORS = ['#f44336', '#2196f3', '#ff9800', '#4caf50', '#9c27b0', '#00bcd4'];

interface MetricChartProps {
    data: Measurement[];
    metric: 'temperature' | 'humidity';
    unit: string;
}

interface StatsChartProps extends MetricChartProps {
    title: string;
}

interface ChartDataPoint {
    ts: string;
    [key: string]: string | number | null;
}

interface TooltipPayloadItem {
    value: number;
    name: string;
    color: string;
    dataKey: string;
}

const transformDataForChart = (data: Measurement[], metric: 'temperature' | 'humidity', sensorIds: number[]): ChartDataPoint[] => {
    const groupedByTime: Record<string, Measurement[]> = {};

    data.forEach(measurement => {
        if (!groupedByTime[measurement.ts]) {
            groupedByTime[measurement.ts] = [];
        }
        groupedByTime[measurement.ts].push(measurement);
    });

    const sortedTimestamps = Object.keys(groupedByTime)
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    return sortedTimestamps.map(ts => {
        const point: Record<string, string | number | null> = { ts };

        sensorIds.forEach(id => {
            const measurement = groupedByTime[ts]?.find(m => m.sensorId === id);
            point[`sensor_${id}`] = measurement ? measurement[metric] : null;
        });

        return point as ChartDataPoint;
    });
}

const CustomTooltip = ({ active, payload, label, unit }: {
    active?: boolean;
    payload?: TooltipPayloadItem[];
    label?: string;
    unit: string
}) => {
    if (active && payload?.length && label) {
        const exactTimestamp = label;

        return (
            <div style={{
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                padding: '10px',
                borderRadius: '4px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                fontSize: '12px'
            }}>
                <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>
                    {new Date(exactTimestamp).toLocaleString()}
                </p>
                {payload.map((entry, index) => (
                    <p key={index} style={{ margin: '2px 0', color: entry.color }}>
                        {entry.name.replace('sensor_', 'Sensor ')}: {(entry.value || 0).toFixed(1)}{unit}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const MetricChart = ({ data, metric, unit }: MetricChartProps) => {
    const sensorIds = Array.from(new Set(data.map(d => d.sensorId)));
    const transformedData = transformDataForChart(data, metric, sensorIds);

    return (
        <ResponsiveContainer width='100%' height={400}>
            <LineChart data={transformedData}>
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis
                    dataKey='ts'
                    tickFormatter={(v: string) => {
                        const date = new Date(v);
                        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
                    }}
                    interval="preserveStartEnd"
                />
                <YAxis />
                <Tooltip
                    content={<CustomTooltip unit={unit} />}
                    isAnimationActive={false}
                    cursor={{ strokeDasharray: "3 3" }}
                    trigger="hover"
                />
                <Legend />
                {sensorIds.map((id, idx) => (
                    <Line
                        key={`sensor-${id}-${metric}`}
                        type='monotone'
                        dataKey={`sensor_${id}`}
                        stroke={COLORS[idx] || '#000'}
                        name={`Sensor ${id}`}
                        dot={false}
                        isAnimationActive={false}
                        connectNulls={true}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
};

const StatsChart = ({ data, title, metric, unit }: StatsChartProps) => {
    return (
        <div>
            <Typography variant="h6" gutterBottom>
                {title}
            </Typography>
            <MetricChart
                data={data}
                metric={metric}
                unit={unit}
            />
        </div>
    )
}

export default function StatsChartWrapper({ data }: Readonly<{ data: Measurement[] }>) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <StatsChart
                title={"Temperature (°C)"}
                data={data}
                metric="temperature"
                unit="°C"
            />
            <StatsChart
                title={"Humidity (%RH)"}
                data={data}
                metric="humidity"
                unit="%RH"
            />
        </div>
    );
}
