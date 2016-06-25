import { TREE_REQUEST, TREE_REQUEST_SUCCESS } from '../constants/actionTypes';

const initialState = {
    loading: false,
    data: []
};

export default function treeReducer(state = initialState, action) {
    switch (action.type) {
        case TREE_REQUEST:
            return Object.assign({}, state, {
                loading: true
            });
        case TREE_REQUEST_SUCCESS:
            return {
                loading: false,
                data: state.data.concat(action.data)
            };
        default:
            return state;
    }
}