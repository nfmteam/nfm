import Promise from 'bluebird';
import fetch from 'isomorphic-fetch';
import {
    TREE_REQUEST,
    TREE_REQUEST_SUCCESS,
    TREE_CONTROL,
    TREE_SYNC_WORKSPACE
} from '../constants/actionTypes';

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

        // TODO: {"code":500,"massge":"EACCES: permission denied, scandir '/tmp/KSOutOfProcessFetcher.0.ppfIhqX0vjaTSb8AJYobDV7Cu68='"}

        Promise.all([
            fetch(`http://localhost:3010/api/v1/list?path=${path}&type=d`).then(response => response.json()),
            Promise.delay(500)
        ]).then(([data]) => {
            dispatch(requestTreeSuccessCreater(data, path));
        });
    }
}