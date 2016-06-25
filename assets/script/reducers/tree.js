import { TREE_REQUEST, TREE_REQUEST_SUCCESS } from '../constants/actionTypes';

const initialState = {
    loading: false,
    currentPath: '',
    data: []
};

export default function treeReducer(state = initialState, action) {
    switch (action.type) {
        case TREE_REQUEST:
            return Object.assign({}, state, {
                loading: true
            });
        case TREE_REQUEST_SUCCESS:
            var index = state.data.findIndex(item => item.path === action.currentPath),
                data;

            if (index === -1) {
                data = action.data;
            } else {
                if(action.data.length > 0) {
                    state.data[index].children = action.data;
                }
                data = state.data;
            }

            return {
                loading: false,
                currentPath: action.currentPath,
                data: data
            };
        default:
            return state;
    }
}