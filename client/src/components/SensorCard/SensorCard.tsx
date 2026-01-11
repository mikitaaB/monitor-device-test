import { Card, CardContent, Typography, Box } from '@mui/material';

interface SensorCardProps {
    sensorId: number;
    temperature: number | null;
    humidity: number | null;
    ts: string | null;
}

export default function SensorCard({
    sensorId,
    temperature,
    humidity,
    ts,
}: Readonly<SensorCardProps>) {
    return (
        <Card sx={{ minWidth: 275, m: 2 }}>
            <CardContent>
                <Typography variant='h6' component='div' gutterBottom>
                    Sensor {sensorId}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant='h6' component='div'>
                        Temperature: {temperature?.toFixed(1) ?? '-'}°C
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant='h6' component='div'>
                        Humidity: {humidity?.toFixed(1) ?? '-'}%RH
                    </Typography>
                </Box>

                <Typography variant='caption' color='text.secondary'>
                    Last updated: {ts ? new Date(ts).toLocaleString() : 'No data'}
                </Typography>
            </CardContent>
        </Card>
    );
}
