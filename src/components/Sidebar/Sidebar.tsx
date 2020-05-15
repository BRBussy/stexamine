import React, {useState} from 'react'
import {Drawer, Hidden, makeStyles, Theme} from "@material-ui/core";
import cx from 'classnames';

const drawerWidth = 260;
const drawerMiniWidth = 80;

const useStyles = makeStyles((theme: Theme) => ({
    drawerPaper: {
        backgroundColor: theme.palette.primary.dark,
        'border': 'none',
        'position': 'fixed',
        'top': '0',
        'bottom': '0',
        'left': '0',
        'zIndex': 1032,
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
            zIndex: 1032,
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
            zIndex: 3,
            width: '100%',
            height: '100%',
            content: '""',
            display: 'block',
            top: '0'
        }
    },
    drawerPaperMini: {
        width: drawerMiniWidth + 'px!important'
    },
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
                    some stuff
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
                    some stuff
                </Drawer>
            </Hidden>
        </div>
    )
}