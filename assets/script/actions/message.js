import {
    MESSAGE_TIPS_ERROR,
    MESSAGE_TIPS_HIDE,
    MESSAGE_TIPS_INFO
} from '../constants/actionTypes';

export function showInfoMessage() {
    return {
        type: MESSAGE_TIPS_INFO
    }
}

export function showErrorMessage() {
    return {
        type: MESSAGE_TIPS_ERROR
    }
}

export function hideMessage() {
    return {
        type: MESSAGE_TIPS_HIDE
    }
}