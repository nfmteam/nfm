import { createSelector } from 'reselect';

const getMessage = state => state.message;
const getWorkspaceCurrentPath = state => state.workspace.currentPath;
const getLoading = state => state.loading;

export default createSelector(
    [getMessage, getWorkspaceCurrentPath, getLoading],
    (message, workspaceCurrentPath, loading) => ({
        message,
        workspaceCurrentPath,
        loading
    })
);
