import React from 'react';
import { render } from 'react-dom';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import App from './containers/App';
import counterApp from './reducers/counter';

const middlewares = [];

if (process.env.NODE_ENV === 'development') {
    /* eslint-disable global-require */
    const createLogger = require('redux-logger');
    /* eslint-enable global-require */

    const logger = createLogger();
    middlewares.push(logger);
}

const store = createStore(
    counterApp,
    applyMiddleware(...middlewares)
);

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);