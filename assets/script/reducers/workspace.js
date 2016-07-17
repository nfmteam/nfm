import {
  WORKSPACE_REQUEST,
  WORKSPACE_REQUEST_SUCCESS
} from '../constants/actionTypes';

const initialState = {
  currentPath: '',
  data: []
};

export default function workspaceReducer(state = initialState, action) {
  switch (action.type) {
    case WORKSPACE_REQUEST:
      return {
        currentPath: action.currentPath,
        data: state.data
      };
    case WORKSPACE_REQUEST_SUCCESS:
      return {
        currentPath: state.currentPath,
        data: action.data
      };
    default:
      return state;
  }
}