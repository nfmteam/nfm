import { applyMiddleware, createStore } from 'redux';
import counterApp from '../reducers/counter';

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

export default store;
