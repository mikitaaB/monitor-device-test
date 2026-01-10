import { Box, ButtonGroup, Button, TextField } from '@mui/material';
import type { RangeOption } from '../../interfaces/stats.interface';

interface StatsFilterProps {
    range: RangeOption;
    day: string;
    onRangeChange: (range: RangeOption) => void;
    onDayChange: (day: string) => void;
}

export default function StatsFilter({ range, day, onRangeChange, onDayChange }: Readonly<StatsFilterProps>) {
    return (
        <Box mb={2} display='flex' alignItems='center' gap={2}>
            <ButtonGroup>
                <Button
                    variant={range === '1h' ? 'contained' : 'outlined'}
                    onClick={() => onRangeChange('1h')}
                >
                    {'Last hour'}
                </Button>
                <Button
                    variant={range === '6h' ? 'contained' : 'outlined'}
                    onClick={() => onRangeChange('6h')}
                >
                    {'Last 6 hours'}
                </Button>
                <Button
                    variant={range === '24h' ? 'contained' : 'outlined'}
                    onClick={() => onRangeChange('24h')}
                >
                    {'Last 24 hours'}
                </Button>
                <Button
                    variant={range === 'day' ? 'contained' : 'outlined'}
                    onClick={() => onRangeChange('day')}
                >
                    {'Select day'}
                </Button>
            </ButtonGroup>
            {range === 'day' && (
                <TextField
                    type='date'
                    value={day}
                    onChange={(e) => onDayChange(e.target.value)}
                />
            )}
        </Box>
    );
};
