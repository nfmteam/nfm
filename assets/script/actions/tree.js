import Promise from 'bluebird';
import fetch from 'isomorphic-fetch';
import { TREE_REQUEST, TREE_REQUEST_SUCCESS } from '../constants/actionTypes';

function requestTree() {
    return {
        type: TREE_REQUEST
    }
}

function requestTreeSuccess(data, path) {
    return {
        type: TREE_REQUEST_SUCCESS,
        currentPath: path,
        data: data,
    }
}

export function getTree(path = '/') {
    return dispatch => {
        dispatch(requestTree());

        Promise.all([
            fetch(`http://localhost:3010/api/v1/list?path=${path}&type=d`).then(response => response.json()),
            Promise.delay(1000)
        ]).then(([data]) => {
            dispatch(requestTreeSuccess(data, path));
        });
    }
}