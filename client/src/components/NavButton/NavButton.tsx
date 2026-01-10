import { Button } from '@mui/material';
import { Link } from '@tanstack/react-router';

interface NavButtonProps {
    to: string;
    label: string;
    currentPath: string;
}

export default function NavButton({ to, label, currentPath }: Readonly<NavButtonProps>) {
    const isActive = currentPath === to;

    return (
        <Button
            color='inherit'
            component={Link}
            to={to}
            disabled={isActive}
            sx={{ minWidth: 120 }}
            variant={isActive ? 'outlined' : 'text'}
        >
            {label}
        </Button>
    );
}
