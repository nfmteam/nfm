import fetch from 'isomorphic-fetch';
import { TREE_REQUEST, TREE_REQUEST_FAIL, TREE_REQUEST_SUCCESS } from '../constants/actionTypes';

export function getTree(path = '/') {
    return dispatch => {
        dispatch({
            type: TREE_REQUEST
        });

        return fetch(`http://localhost:3010/api/v1/list?path=${path}`)
            .then(response => response.json())
            .then(data => {
                dispatch({
                    type: TREE_REQUEST_SUCCESS,
                    data: data
                });
            });
    }
}