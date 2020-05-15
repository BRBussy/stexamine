import {ThemeProvider, createMuiTheme} from '@material-ui/core';
import React from 'react';

export const defaultTheme = createMuiTheme({
    props: {
        MuiTextField: {
            margin: 'dense'
        }
    },
    overrides: {
        MuiCardHeader: {
            root: {
                padding: '8px'
            },
        },
        MuiCardContent: {
            root: {
                borderTop: '1px solid rgba(255, 255, 255, 0.12)',
                padding: '8px'
            }
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