import {Route} from './Route';
import Transaction from 'views/Transaction/Transaction';
import {
    Money as TransactionIcon
} from '@material-ui/icons';

export const defaultRoute: Route = {
    name: 'Transaction',
    path: '/transaction',
    component: Transaction,
    icon: TransactionIcon
}

export const publicRoutes: Route[] = [
    defaultRoute
]
