import {Route} from './Route';
import LandingPage from 'views/LandingPage';
import Login from 'views/Login';

export const publicRoutes: Route[] = [
    {
        path: '/',
        component: LandingPage
    },
    {
        path: '/login',
        component: Login
    }
]