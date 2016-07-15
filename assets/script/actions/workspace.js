import fetch from '../lib/fetch';
import { WORKSPACE_REQUEST, WORKSPACE_REQUEST_SUCCESS } from '../constants/actionTypes';
import { syncTree } from './tree';
import { beginLoadingCreater, endLoadingCreater } from './loadingbar';
import { showErrorMessageCreater } from './message';

/**
 * Action Creater
 */

function requestWorkspaceCreater(path) {
    return {
        type: WORKSPACE_REQUEST,
        currentPath: path
    }
}

function requestWorkspaceSuccessCreater(data) {
    return {
        type: WORKSPACE_REQUEST_SUCCESS,
        data: data
    }
}

/**
 * Async Action Creater
 */
export function getWorkspaceFiles(path = '/') {
    return dispatch => {
        dispatch(beginLoadingCreater());
        dispatch(requestWorkspaceCreater(path));

        fetch('GET', `http://localhost:3010/api/list?path=${path}`)
            .then(data => {
                dispatch(syncTree(path, data));
                dispatch(requestWorkspaceSuccessCreater(sortFiles(data)));
                dispatch(endLoadingCreater());
            })
            .catch(message => {
                dispatch(showErrorMessageCreater(message));
                dispatch(endLoadingCreater());
            });
    }
}

/**
 * Helpers
 */

function sortFiles(data) {
    return data.sort((a, b) => {
        var result;

        if (a.type === 'f' && b.type === 'd') {
            result = 1;
        } else if (a.type === 'd' && b.type === 'f') {
            result = -1;
        } else if (a.name < b.name) {
            result = -1;
        } else if (a.name > b.name) {
            result = 1;
        } else {
            result = 0
        }

        return result;
    });
}