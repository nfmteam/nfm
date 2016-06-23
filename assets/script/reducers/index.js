import CounterReducer from './counter';
import TreeReducer from './tree';
import { combineReducers } from 'redux'

export default combineReducers({
    counter: CounterReducer,
    tree: TreeReducer
});