import React from 'react'
import {makeStyles} from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
}));

export default function LandingPage() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            awe we land!
        </div>
    )
}