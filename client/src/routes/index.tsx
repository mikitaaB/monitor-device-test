import { createRoute, createRouter } from '@tanstack/react-router';
import { rootRoute } from './root';
import MonitoringPage from '../pages/MonitoringPage';
import StatsPage from '../pages/StatsPage';

const monitoringRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/',
	component: MonitoringPage,
});

const statsRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/stats',
	component: StatsPage,
});

const routeTree = rootRoute.addChildren([monitoringRoute, statsRoute]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}
}
