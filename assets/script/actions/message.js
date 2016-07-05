import { MESSAGE_TIPS_ERROR, MESSAGE_TIPS_HIDE, MESSAGE_TIPS_INFO } from '../constants/actionTypes';

/**
 * Action Creater
 */

function showInfoMessageCreater(text) {
    return {
        type: MESSAGE_TIPS_INFO,
        text: text,
        show: true
    }
}

export function showErrorMessageCreater(text) {
    return {
        type: MESSAGE_TIPS_ERROR,
        text: text,
        show: true
    }
}

export function hideMessageCreater() {
    return {
        type: MESSAGE_TIPS_HIDE,
        text: '',
        show: false
    }
}

/**
 * Async Action Creater
 */

export function showInfoMessage(text) {
    return dispatch => {
        dispatch(showInfoMessageCreater(text));

        setTimeout(
            () => dispatch(hideMessageCreater()),
            2000
        )
    };
}