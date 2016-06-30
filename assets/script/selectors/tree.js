import { createSelector } from 'reselect';

const getData = (state) => state.tree.data;
const getCurrentId = (state) => state.tree.currentId;

export default createSelector(
    [getData, getCurrentId],
    (data, currentId) => ({
        data,
        currentId
    })
);