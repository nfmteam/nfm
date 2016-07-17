import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { browserHistory } from 'react-router';
import { routerMiddleware } from 'react-router-redux';
import Reducers from '../reducers';

const middlewares = [thunk, routerMiddleware(browserHistory)];

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
