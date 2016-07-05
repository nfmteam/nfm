import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import treeReducer from './tree';
import workspaceReducer from './workspace';
import messageReducer from './message';

export default combineReducers({
    tree: treeReducer,
    workspace: workspaceReducer,
    message: messageReducer,
    routing: routerReducer
});