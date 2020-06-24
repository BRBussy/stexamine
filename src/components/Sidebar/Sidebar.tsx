import React, {useState} from 'react'
import {Drawer, Hidden, List, ListItem, ListItemIcon, ListItemText, makeStyles, Theme} from '@material-ui/core';
import cx from 'classnames';
import {Route} from 'route/Route';
import {publicRoutes} from 'route';
import {useHistory} from 'react-router-dom';

export const drawerWidth = 260;
export const drawerMiniWidth = 55;

const useStyles = makeStyles((theme: Theme) => ({
    drawerPaper: {
        overflow: 'hidden',
        backgroundColor: theme.palette.primary.dark,
        'border': 'none',
        'position': 'fixed',
        'top': '0',
        'bottom': '0',
        'left': '0',
        'transitionProperty': 'top, bottom, width',
        'transitionDuration': '.2s, .2s, .35s',
        'transitionTimingFunction': 'linear, linear, ease',
        boxShadow: '0 10px 20px -12px rgba(0, 0, 0, 0.42), 0 3px 20px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)',
        'width': drawerWidth,
        [theme.breakpoints.up('md')]: {
            width: drawerWidth,
            position: 'fixed',
            height: '100%'
        },
        [theme.breakpoints.down('sm')]: {
            width: drawerWidth,
            boxShadow: '0 10px 30px -12px rgba(0, 0, 0, 0.42), 0 4px 25px 0px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)',
            position: 'fixed',
            display: 'block',
            top: '0',
            height: '100vh',
            right: '0',
            left: 'auto',
            visibility: 'visible',
            overflowY: 'visible',
            borderTop: 'none',
            textAlign: 'left',
            paddingRight: '0px',
            paddingLeft: '0',
            transform: `translate3d(${drawerWidth}px, 0, 0)`,
            transition: 'all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)'
        },
        '&:before,&:after': {
            position: 'absolute',
            width: '100%',
            height: '100%',
            content: '""',
            display: 'block',
            top: '0'
        }
    },
    drawerPaperMini: {
        width: drawerMiniWidth + 'px!important'
    }
}))

interface SidebarProps {
    open: boolean;
    handleSidebarToggle: () => void;
    miniActive: boolean;
}

export default function Sidebar(props: SidebarProps) {
    const classes = useStyles();
    const [miniActive, setMiniActive] = useState(true);

    const sidebarMinimized = props.miniActive && miniActive;

    const drawerPaper = cx(
        classes.drawerPaper,
        {
            [classes.drawerPaperMini]:
            sidebarMinimized
        }
    );

    return (
        <div>
            <Hidden mdUp>
                <Drawer
                    variant={'temporary'}
                    anchor={'right'}
                    classes={{paper: drawerPaper}}
                    open={props.open}
                    onClose={props.handleSidebarToggle}
                    ModalProps={{keepMounted: true}}
                >
                    <SidebarItems appRoutes={publicRoutes}/>
                </Drawer>
            </Hidden>
            <Hidden smDown>
                <Drawer
                    classes={{paper: drawerPaper}}
                    onMouseOver={() => setMiniActive(false)}
                    onMouseOut={() => setMiniActive(true)}
                    anchor={'left'}
                    variant={'permanent'}
                    open
                >
                    <SidebarItems appRoutes={publicRoutes}/>
                </Drawer>
            </Hidden>
        </div>
    )
}


interface SidebarItemsProps {
    appRoutes: Route[];
}

const useSidebarItemsStyles = makeStyles((theme: Theme) => ({
    list: {
        zIndex: 3000,
        cursor: 'pointer'
    }
}))

function SidebarItems({appRoutes}: SidebarItemsProps) {
    const classes = useSidebarItemsStyles()
    const history = useHistory()

    return (
        <List className={classes.list}>
            {(appRoutes.map((route, idx) => (
                <ListItem
                    key={idx}
                    onClick={() => history.push(route.path)}
                    selected={history.location.pathname === route.path}
                >
                    <ListItemIcon>
                        <route.icon/>
                    </ListItemIcon>
                    <ListItemText
                        primaryTypographyProps={{noWrap: true}}
                        primary={route.name}
                    />
                </ListItem>
            )))}
        </List>
    )
}
