import fetch from '../lib/fetch';
import {
    TREE_REQUEST,
    TREE_REQUEST_SUCCESS,
    TREE_CONTROL,
    TREE_SYNC_WORKSPACE
} from '../constants/actionTypes';
import { showErrorMessageCreater } from './message';

/**
 * Action Creater
 */

function requestTreeCreater(path) {
    return {
        type: TREE_REQUEST,
        currentPath: path
    }
}

function requestTreeSuccessCreater(data, path) {
    return {
        type: TREE_REQUEST_SUCCESS,
        currentPath: path,
        data: data
    }
}

export function controlTreeCreater(path) {
    return {
        type: TREE_CONTROL,
        currentPath: path
    }
}

export function syncTree(path, data) {
    return {
        type: TREE_SYNC_WORKSPACE,
        currentPath: path,
        data: data
    }
}

/**
 * Async Action Creater
 */

export function getTree(path = '/') {
    return dispatch => {
        dispatch(requestTreeCreater(path));

        fetch('GET', `http://localhost:3010/api/v1/list?path=${path}&type=d`)
            .then(data => {
                dispatch(requestTreeSuccessCreater(data, path));
            })
            .catch(message => {
                dispatch(showErrorMessageCreater(message));
            });
    }
}