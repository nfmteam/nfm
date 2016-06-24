import counterReducer from './counter';
import treeReducer from './tree';
import { combineReducers } from 'redux'

export default combineReducers({
    counter: counterReducer,
    tree: treeReducer
});