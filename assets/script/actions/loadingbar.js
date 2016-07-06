import { LOADINGBAR_BEGIN, LOADINGBAR_END } from '../constants/actionTypes';

/**
 * Action Creater
 */

export function loadingBegin() {
    return {
        type: LOADINGBAR_BEGIN
    }
}

export function loadingEnd() {
    return {
        type: LOADINGBAR_END
    }
}