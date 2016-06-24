import { TREE_REQUEST, TREE_REQUEST_SUCCESS } from '../constants/actionTypes';

const initialState = {
    message: '',
    data: []
};

export default function treeReducer(state = initialState, action) {
    switch (action.type) {
        case TREE_REQUEST:
            return Object.assign({}, state, {
                message: action.message
            });
        case TREE_REQUEST_SUCCESS:
            return {
                message: '',
                data: state.data.concat(action.data)
            };
        default:
            return state;
    }
}