import { ADD_COUNT, SUBTRACT_COUNT, CLEAN_COUNT } from '../constants/actionTypes';

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

export function cleanCount() {
    return {
        type: CLEAN_COUNT
    }
}