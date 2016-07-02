import { createSelector } from 'reselect';

const getMessage = (state) => {
    return state.message
};

export default createSelector(
    getMessage,
    message => ({message})
);
