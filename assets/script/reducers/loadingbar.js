import { LOADINGBAR_BEGIN, LOADINGBAR_END } from '../constants/actionTypes';

const initialState = false;

export default function loadingbarReducer(state = initialState, action) {
  switch (action.type) {
    case LOADINGBAR_BEGIN:
      return true;
    case LOADINGBAR_END:
      return false;
    default:
      return state;
  }
}