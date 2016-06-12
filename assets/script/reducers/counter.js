import { ADD_COUNT, SUBTRACT_COUNT, CLEAN_COUNT } from '../constants/actionTypes';
import { addCount, subtractCount, cleanCount } from '../actions/counter';

const initialState = {
    count: 0
};

export default function counter(state = initialState, action) {
    switch (action.type) {
        case ADD_COUNT:
            return {
                count: ++state.count
            };
        case SUBTRACT_COUNT:
            return {
                count: --state.count
            };
        case CLEAN_COUNT:
            return {
                count: 0
            };
        default:
            return state;
    }
}