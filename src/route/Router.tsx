import React from 'react';
import {Route as ReactRouterRoute, Switch} from 'react-router';
import {Route} from './Route';

interface RouterProps {
    routes: Route[];
}

const Router = (props: RouterProps) => {
    const routesToRender: React.ReactNode[] = [];
    props.routes.forEach((route, routeKey) => {
        // for collapsed routes, we return a route object for each embedded view
        if (route.collapse) {
            if (route.views == null) {
                return;
            }
            route.views.forEach((viewsRoute, viewsKey) => {
                routesToRender.push(
                    <ReactRouterRoute
                        key={`${routeKey}-${viewsKey}`}
                        exact
                        path={viewsRoute.path}
                        component={viewsRoute.component}
                    />
                );
            })
            return;
        }

        // for normal route objects, we return a route object
        if (route.component == null) {
            return;
        }

        routesToRender.push(
            <ReactRouterRoute
                key={`${routeKey}`}
                exact
                path={route.path}
                component={route.component}
            />
        )
    });

    return (
        <Switch>
            {routesToRender}
        </Switch>
    );
};

export default Router;
