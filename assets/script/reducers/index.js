import { combineReducers } from 'redux'

import counterReducer from './counter';
import treeReducer from './tree';
import messageReducer from './message';

export default combineReducers({
    counter: counterReducer,
    tree: treeReducer,
    message: messageReducer
});