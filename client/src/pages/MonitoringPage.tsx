import { useEffect, useState } from 'react';
import SensorCard from '../components/SensorCard';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { API_BASE_URL } from '../constants';

interface SensorData {
	sensorId: number;
	temperature: number | null;
	humidity: number | null;
	ts: string | null;
}

export default function MonitoringPage() {
	const [sensors, setSensors] = useState<SensorData[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const eventSource = new EventSource(`${API_BASE_URL}/stream`);

		eventSource.addEventListener('reading', (e) => {
			const measurement = JSON.parse(e.data);

			setLoading(false);
			setSensors((prev) => {
				const existingIndex = prev.findIndex(sensor => sensor.sensorId === measurement.sensorId);

				if (existingIndex >= 0) {
					return prev.map(sensor => sensor.sensorId === measurement.sensorId
						? {
							...sensor,
							temperature: measurement.temperature,
							humidity: measurement.humidity,
							ts: measurement.ts,
						}
						: sensor
					);
				}

				return prev.concat({
					sensorId: measurement.sensorId,
					temperature: measurement.temperature,
					humidity: measurement.humidity,
					ts: measurement.ts,
				});
			});
		});

		eventSource.addEventListener('error', (e: MessageEvent) => {
			console.error('SSE error:', e);

			let errorData: { sensorId: number };
			try {
				errorData = JSON.parse(e.data) as { sensorId: number };
			} catch (err) {
				console.error('Failed to parse SSE error payload:', err);
				setLoading(false);
				return;
			}

			setLoading(false);

			if (!errorData.sensorId) return;

			setSensors((prev) => {
				const existing = prev.find(sensor => sensor.sensorId === errorData.sensorId);

				if (existing) {
					return prev.map(sensor =>
						sensor.sensorId === errorData.sensorId
							? { ...sensor, temperature: null, humidity: null, ts: null }
							: sensor
					);
				}

				return prev.concat({
					sensorId: errorData.sensorId,
					temperature: null,
					humidity: null,
					ts: null,
				});
			});
		});

		return () => eventSource.close();
	}, []);

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
			<Typography variant='h5' gutterBottom align='center' sx={{ mt: 2 }}>
				{"Online Monitoring"}
			</Typography>

			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'flex-start',
					flexWrap: 'wrap',
					flexGrow: 1,
					p: 2,
				}}
			>
				{loading ? (
					<Typography align='center' sx={{ width: '100%', mt: 4 }}>
						{'Waiting for device data...'}
					</Typography>
				) : sensors.length === 0 ? (
					<Typography align='center' sx={{ width: '100%', mt: 4 }}>
						{'No device and sensors available'}
					</Typography>
				) : (
					sensors.map(sensor => (
						<SensorCard
							key={sensor.sensorId}
							sensorId={sensor.sensorId}
							temperature={sensor.temperature}
							humidity={sensor.humidity}
							ts={sensor.ts}
						/>
					))
				)}
			</Box>
		</Box>
	);
}
