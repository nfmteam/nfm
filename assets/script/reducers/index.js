import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import treeReducer from './tree';
import workspaceReducer from './workspace';
import messageReducer from './message';
import loadingbarReducer from './loadingbar';

export default combineReducers({
  loading: loadingbarReducer,
  tree: treeReducer,
  workspace: workspaceReducer,
  message: messageReducer,
  routing: routerReducer
});