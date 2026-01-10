import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Box } from '@mui/material';
import NavBar from '../components/NavBar';

export function RootLayout() {
    return (
        <Box>
            <NavBar />
            <Outlet />
        </Box>
    );
}

export const rootRoute = createRootRoute({
    component: RootLayout,
});
