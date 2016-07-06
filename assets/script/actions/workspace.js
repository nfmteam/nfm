import Promise from 'bluebird';
import fetch from 'isomorphic-fetch';
import { WORKSPACE_REQUEST, WORKSPACE_REQUEST_SUCCESS } from '../constants/actionTypes';
import { syncTree } from './tree';
import { loadingEnd, loadingBegin } from './loadingbar';

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
        dispatch(loadingBegin());
        dispatch(requestWorkspaceCreater(path));

        // TODO: {"code":500,"massge":"EACCES: permission denied, scandir '/tmp/KSOutOfProcessFetcher.0.ppfIhqX0vjaTSb8AJYobDV7Cu68='"}

        Promise.all([
            fetch(`http://localhost:3010/api/v1/list?path=${path}`).then(response => response.json()),
            Promise.delay(500)
        ]).then(([data]) => {
            dispatch(syncTree(path, data));
            dispatch(requestWorkspaceSuccessCreater(sortFiles(data)));
            dispatch(loadingEnd());
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