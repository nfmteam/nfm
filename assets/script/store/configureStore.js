import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import Reducers from '../reducers';

const middlewares = [thunk];

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
