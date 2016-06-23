import { applyMiddleware, createStore } from 'redux';
import promiseMiddleware from 'redux-promise';
import Reducers from '../reducers';

const middlewares = [promiseMiddleware];

if (process.env.NODE_ENV === 'development') {
    /* eslint-disable global-require */
    const createLogger = require('redux-logger');
    /* eslint-enable global-require */

    const logger = createLogger();
    middlewares.push(logger);
}

const store = createStore(
    Reducers,
    applyMiddleware(...middlewares)
);

export default store;
