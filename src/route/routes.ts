import {Route} from './Route';
import Transaction from "views/Transaction/Transaction";

export const defaultRoute: Route = {
    path: '/transaction',
    component: Transaction
}

export const publicRoutes: Route[] = [
    defaultRoute
]