import Promise from 'bluebird';
import fetch from 'isomorphic-fetch';
import { TREE_REQUEST, TREE_REQUEST_SUCCESS } from '../constants/actionTypes';

function requestTree(id) {
    return {
        type: TREE_REQUEST,
        currentId: id
    }
}

function requestTreeSuccess(data, id) {
    return {
        type: TREE_REQUEST_SUCCESS,
        currentId: id,
        data: data
    }
}

export function getTree(path = '/', id = '0') {
    return dispatch => {
        dispatch(requestTree(id));

        Promise.all([
            fetch(`http://localhost:3010/api/v1/list?path=${path}&type=d`).then(response => response.json()),
            Promise.delay(1000)
        ]).then(([data]) => {
            dispatch(requestTreeSuccess(data, id));
        });
    }
}