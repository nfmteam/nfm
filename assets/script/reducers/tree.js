import { TREE_REQUEST } from '../constants/actionTypes';
import { handleActions } from 'redux-actions';

const initialState = {
    data: []
};

export default handleActions({
    [TREE_REQUEST]: (state, action) => ({
        data: state.data.concat(action.payload)
    })
}, initialState);