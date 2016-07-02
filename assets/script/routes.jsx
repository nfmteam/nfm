import React from 'react';
import { Route, IndexRoute, IndexRedirect, Redirect } from 'react-router';
import App from './containers/App.jsx';
import Browser from './containers/Browser.jsx';
import Test1 from './containers/Test1.jsx';
import Test2 from './containers/Test2.jsx';

const defaultWorkspacePath = encodeURIComponent('/');

export default (
    <Route path='/' component={App}>
        <IndexRedirect to={`/browser/${defaultWorkspacePath}`} />

        <Route path='browser/:workspacePath' component={Browser} />
        <Route path='browser/search/:keyword' component={Browser} />
        <Route path='test1' component={Test1} />
        <Route path='test2' component={Test2} />

        <Redirect from='*' to={`/browser/${defaultWorkspacePath}`} />
    </Route>
);