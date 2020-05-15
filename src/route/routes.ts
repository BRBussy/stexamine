import {Route} from './Route';
import Transaction from "views/Transaction/Transaction";

export const publicRoutes: Route[] = [
    {
        path: '/transaction',
        component: Transaction
    }
]