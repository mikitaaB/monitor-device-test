import { AppBar, Toolbar } from '@mui/material';
import { useRouterState } from '@tanstack/react-router';
import NavButton from '../NavButton';

export default function NavBar() {
    const routerState = useRouterState();
    const currentPath = routerState.location.pathname;

    return (
        <AppBar position='relative'>
            <Toolbar sx={{ justifyContent: 'center', gap: 2 }}>
                <NavButton
                    currentPath={currentPath}
                    label='Monitoring'
                    to='/'
                />
                <NavButton
                    currentPath={currentPath}
                    label='Statistics'
                    to='/stats'
                />
            </Toolbar>
        </AppBar>
    );
}
