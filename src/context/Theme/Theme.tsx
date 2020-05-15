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
        primary: {
            light: '#4c8c4a',
            main: '#1b5e20',
            dark: '#003300'
        },
        secondary: {
            light: '#9c786c',
            main: '#6d4c41',
            dark: '#40241a',
            contrastText: '#ffffff'
        },
        error: {
            light: '#e57373',
            main: '#f44336',
            dark: '#d32f2f',
            contrastText: '#ffffff'
        },
        text: {
            primary: '#212121',
            secondary: '#757575',
            disabled: 'rgba(255, 255, 255, 0.38)',
            hint: 'rgba(255, 255, 255, 0.38)'
        },
        divider: '#BDBDBD',
        // background: {
        //     paper: '#232041',
        //     default: 'rgba(18, 16, 39, 1)'
        // },
        action: {
            active: '#fff',
            hover: 'rgba(0, 0, 0, 0.2)',
            hoverOpacity: 0.1,
            selected: 'rgba(0, 0, 0, 0.4)',
            disabled: 'rgba(255, 255, 255, 0.3)',
            disabledBackground: 'rgba(255, 255, 255, 0.12)'
        }
    },
    typography: {
        fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif'
    }
});

export default function ThemeContext({children}: { children: React.ReactNode }) {
    return (
        <ThemeProvider theme={defaultTheme}>
            {children}
        </ThemeProvider>
    );
};