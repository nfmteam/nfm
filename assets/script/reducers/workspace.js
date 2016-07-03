import merge from 'lodash.merge';
import {
    WORKSPACE_REQUEST,
    WORKSPACE_REQUEST_SUCCESS
} from '../constants/actionTypes';

const initialState = {
    currentPath: '',
    data: []
};

export default function workspaceReducer(state = initialState, action) {
    switch (action.type) {
        case WORKSPACE_REQUEST:
            return merge({}, state, {
                currentPath: action.currentPath
            });
        case WORKSPACE_REQUEST_SUCCESS:
            return merge({}, state, {
                data: action.data
            });
        default:
            return state;
    }
}