import { MESSAGE_TIPS_ERROR, MESSAGE_TIPS_HIDE, MESSAGE_TIPS_INFO } from '../constants/actionTypes';

/**
 * Action Creater
 */

function showInfoMessageCreater(text) {
    return {
        type: MESSAGE_TIPS_INFO,
        text: text,
        level: 'Info'
    }
}

export function showErrorMessageCreater(text) {
    return {
        type: MESSAGE_TIPS_ERROR,
        text: text,
        level: 'Error'
    }
}

export function hideMessageCreater() {
    return {
        type: MESSAGE_TIPS_HIDE
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
            5000
        )
    };
}