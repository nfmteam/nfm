import {ADD_COUNT, SUBTRACT_COUNT, CLEAN_COUNT} from '../constants/actionTypes';
import {handleActions} from 'redux-actions';

const initialState = {
    count: 0
};

export default handleActions({
    [ADD_COUNT]: (state, action) => ({
        count: ++state.count
    }),
    [SUBTRACT_COUNT]: (state, action) => ({
        count: --state.count
    }),
    [CLEAN_COUNT]: (state, action) => ({
        count: 0
    })
}, initialState);