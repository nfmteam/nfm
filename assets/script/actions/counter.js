import { ADD_COUNT, SUBTRACT_COUNT, CLEAN_COUNT } from '../constants/actionTypes';
import { showInfoMessage } from './message';

export function addCount() {
    return {
        type: ADD_COUNT
    }
}

export function subtractCount() {
    return {
        type: SUBTRACT_COUNT
    }
}

function _cleanCount() {
    return {
        type: CLEAN_COUNT
    }
}

export function cleanCount() {
    return dispatch => {
        dispatch(showInfoMessage('clean!'));
        dispatch(_cleanCount());
    };
}

export function addCountAsync() {
    return dispatch => {
        setTimeout(() => dispatch(addCount()), 1500)
    };
}