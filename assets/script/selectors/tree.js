import { createSelector } from 'reselect';

const getData = (state) => state.tree.data;
const getCurrentId = (state) => state.tree.currentId;
const getLoading = (state) => state.tree.loading;

export default createSelector(
    [getData, getCurrentId, getLoading],
    (data, currentId, loading) => ({
        data,
        currentId,
        loading
    })
);