import { createSelector } from 'reselect';

const getText = (state) => state.message.text;
const getShow = (state) => state.message.show;

export default createSelector(
    [getText, getShow],
    (text, show) => ({
        text,
        show
    })
);
