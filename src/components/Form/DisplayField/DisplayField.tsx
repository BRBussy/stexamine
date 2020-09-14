import React, {ReactNode} from 'react';
import {Theme, Typography, TypographyProps} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

interface DisplayFieldProps {
    label: string;
    value: ReactNode;
    labelTypographyProps?: TypographyProps;
    valueTypographyProps?: TypographyProps;
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
                {...props.labelTypographyProps}
            />
            <Typography
                variant={'body2'}
                children={props.value}
                {...props.valueTypographyProps}
            />
        </div>
    )
}
