import { useEffect, useState } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import StatsFilter from '../components/StatsFilter';
import StatsChart from '../components/StatsChart';
import { getStatsAPI } from '../api/measures';
import type { Measurement, RangeOption } from '../interfaces/stats.interface';

const StatsPage = () => {
	const [data, setData] = useState<Measurement[]>([]);
	const [range, setRange] = useState<RangeOption>('1h');
	const [day, setDay] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);

	const content = (() => {
		if (loading) {
			return <Typography>{'Loading data...'}</Typography>;
		}
		if (data.length === 0) {
			return <Typography>{'No data available for the selected range.'}</Typography>;
		}
		return <StatsChart data={data} />;
	})();

	const fetchData = async (): Promise<void> => {
		setLoading(true);
		try {
			let from: Date;
			let to = new Date();

			switch (range) {
				case '1h':
					from = new Date(to.getTime() - 60 * 60 * 1000);
					break;
				case '6h':
					from = new Date(to.getTime() - 6 * 60 * 60 * 1000);
					break;
				case '24h':
					from = new Date(to.getTime() - 24 * 60 * 60 * 1000);
					break;
				case 'day':
					from = new Date(day + 'T00:00:00');
					to = new Date(day + 'T23:59:59');
					break;
				default:
					from = new Date(to.getTime() - 60 * 60 * 1000);
			}

			const statRes = await getStatsAPI({
				from: from.toISOString(),
				to: to.toISOString(),
			});
			setData(statRes);
		} catch {
			setData([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, [range, day]);

	return (
		<Card>
			<CardContent>
				<StatsFilter
					range={range}
					day={day}
					onRangeChange={setRange}
					onDayChange={setDay}
				/>
				{content}
			</CardContent>
		</Card>
	);
};

export default StatsPage;
