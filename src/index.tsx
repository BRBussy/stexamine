import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {CssBaseline} from '@material-ui/core';
import * as serviceWorker from './serviceWorker';
import ThemeContext from 'context/Theme';

ReactDOM.render(
    <React.StrictMode>
        <ThemeContext>
            <CssBaseline/>
            <App/>
        </ThemeContext>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
