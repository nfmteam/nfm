import { Route, IndexRoute } from 'react-router';
import App from './containers/App.jsx';
import Browser from './containers/Browser.jsx';

export default (
    <Route path='/' component={App}>
        <IndexRoute component={Browser}/>
        <Route path="*" component={Browser}/>
    </Route>
);