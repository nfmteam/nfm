export const ADD_COUNT = 'ADD_COUNT';
export const SUBTRACT_COUNT = 'SUBTRACT_COUNT';
export const CLEAN_COUNT = 'CLEAN_COUNT';

export function addCount() {
    return {
        type: ADD_COUNT
    }
}

export function subtractCount() {
    return {
        type: SUBTRACT_COUNT
    }
}

export function cleanCount() {
    return {
        type: CLEAN_COUNT
    }
}