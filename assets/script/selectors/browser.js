import { createSelector } from 'reselect';

const getCount = (state) => state.counter.count;
const getTreeData = (state) => state.tree.data;
const getTreeCurrentId = (state) => state.tree.currentId;

export default createSelector(
    [getCount, getTreeData, getTreeCurrentId],
    (count, data, currentId) => ({
        count,
        tree: {
            data,
            currentId
        }
    })
);