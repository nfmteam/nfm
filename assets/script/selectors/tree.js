import { createSelector } from 'reselect';

const getData = (state) => state.tree.data;
const getLoading = (state) => state.tree.loading;

export default createSelector(
    [getData, getLoading],
    (data, loading) => ({
        data,
        loading
    })
);