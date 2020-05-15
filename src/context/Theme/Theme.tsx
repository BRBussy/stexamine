import {ThemeProvider, createMuiTheme} from '@material-ui/core';
import React from 'react';

export const defaultTheme = createMuiTheme({
    props: {
        MuiTextField: {
            margin: 'dense'
        }
    },
    shape: {
        borderRadius: 4
    },
    palette: {
        type: 'dark'
    },
});

export default function ThemeContext({children}: { children: React.ReactNode }) {
    return (
        <ThemeProvider theme={defaultTheme}>
            {children}
        </ThemeProvider>
    );
};