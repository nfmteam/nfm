import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import App from './containers/App.jsx';
import Browser from './containers/Browser.jsx';
import store from './store/configureStore';

const history = syncHistoryWithStore(browserHistory, store);

render(
    <Provider store={store}>
        <Router history={history}>
            <Route path='/' component={App}>
                <IndexRoute component={Browser}/>
                <Route path="*" component={Browser}/>
            </Route>
        </Router>
    </Provider>,
    document.getElementById('root')
);