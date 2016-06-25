import { MESSAGE_TIPS_ERROR, MESSAGE_TIPS_HIDE, MESSAGE_TIPS_INFO } from '../constants/actionTypes';

function _showInfoMessage(text) {
    return {
        type: MESSAGE_TIPS_INFO,
        text: text,
        show: true
    }
}

export function showInfoMessage(text) {
    return dispatch => {
        dispatch(_showInfoMessage(text));

        setTimeout(
            () => dispatch(hideMessage()),
            2000
        )
    };
}

export function showErrorMessage(text) {
    return {
        type: MESSAGE_TIPS_ERROR,
        text: text,
        show: true
    }
}

export function hideMessage() {
    return {
        type: MESSAGE_TIPS_HIDE,
        text: '',
        show: false
    }
}