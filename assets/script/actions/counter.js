import { createAction } from 'redux-actions';
import { ADD_COUNT, ADD_COUNT_ASYNC, SUBTRACT_COUNT, CLEAN_COUNT } from '../constants/actionTypes';

export let addCount = createAction(ADD_COUNT);
export let subtractCount = createAction(SUBTRACT_COUNT);
export let cleanCount = createAction(CLEAN_COUNT);
export let addCountAsync = createAction(
    ADD_COUNT_ASYNC,
    () => new Promise(resolve => {
        setTimeout(() => {
            resolve(3)
        }, 1500);
    })
);