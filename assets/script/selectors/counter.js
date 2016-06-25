import { createSelector } from 'reselect';

const getCount = (state) => state.counter.count;

export default createSelector(
    getCount,
    count => count
);