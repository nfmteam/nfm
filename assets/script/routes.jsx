import React from 'react';
import { Route, IndexRedirect, Redirect } from 'react-router';
import App from './containers/App.jsx';
import Browser from './containers/Browser.jsx';

const defaultWorkspacePath = encodeURIComponent('/');

export default (
    <Route path='/' component={App}>
        <IndexRedirect to={`/browser/${defaultWorkspacePath}`} />

        <Route path='browser/:workspacePath' component={Browser} />
        <Route path='browser/search/:keyword' component={Browser} />

        <Redirect from='*' to={`/browser/${defaultWorkspacePath}`} />
    </Route>
);