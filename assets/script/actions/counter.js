import {createAction} from 'redux-actions';
import {ADD_COUNT, SUBTRACT_COUNT, CLEAN_COUNT} from '../constants/actionTypes';

export let addCount = createAction(ADD_COUNT);
export let subtractCount = createAction(SUBTRACT_COUNT);
export let cleanCount = createAction(CLEAN_COUNT);

export function addCountAsync() {
    return addCount(new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 3000);
    }))
}