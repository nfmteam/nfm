import { createSelector } from 'reselect';

const getMessage = (state) => state.message;
const getWorkspaceCurrentPath = (state) => state.workspace.currentPath;

export default createSelector(
    [getMessage, getWorkspaceCurrentPath],
    (message, workspaceCurrentPath) => ({
        message,
        workspaceCurrentPath
    })
);
