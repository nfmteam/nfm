import fetch from 'isomorphic-fetch';
import { createAction } from 'redux-actions';
import { TREE_REQUEST, TREE_REQUEST_FAIL, TREE_REQUEST_SUCCESS } from '../constants/actionTypes';

function getTreeData(path = '/') {
    return fetch(`http://localhost:3010/api/v1/list?path=${path}`)
        .then(response => response.json())
}

export let getTree = createAction(
    TREE_REQUEST,
    getTreeData
);