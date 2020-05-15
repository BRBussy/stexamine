import React from 'react';
import {Theme, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

interface DisplayFieldProps {
    label: string;
    value: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        margin: theme.spacing(0.5)
    }
}))

export default function DisplayField(props: DisplayFieldProps) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Typography
                color={'textSecondary'}
                variant={'caption'}
                children={props.label}
            />
            <Typography
                variant={'body2'}
                children={props.value}
            />
        </div>
    )
}