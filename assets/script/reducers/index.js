import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import counterReducer from './counter';
import treeReducer from './tree';
import workspaceReducer from './workspace';
import messageReducer from './message';

export default combineReducers({
    counter: counterReducer,
    tree: treeReducer,
    workspace: workspaceReducer,
    message: messageReducer,
    routing: routerReducer
});