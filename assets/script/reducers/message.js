import { MESSAGE_TIPS_INFO, MESSAGE_TIPS_ERROR, MESSAGE_TIPS_HIDE } from '../constants/actionTypes';

const initialState = {
    text: '',
    show: false
};

export default function counterReducer(state = initialState, action) {
    switch (action.type) {
        case MESSAGE_TIPS_INFO:
        case MESSAGE_TIPS_ERROR:
            return Object.assign({}, state, {
                show: true,
                text: action.text
            });
        case MESSAGE_TIPS_HIDE:
            return {
                show: false,
                text: ''
            };
        default:
            return state;
    }
}