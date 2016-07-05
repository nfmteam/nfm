import { createSelector } from 'reselect';

const getTreeData = (state) => state.tree.data;
const getTreeCurrentPath = (state) => state.tree.currentPath;
const getWorkspaceCurrentPath = (state) => state.workspace.currentPath;
const getWorkspaceData = (state) => state.workspace.data;

export default createSelector(
    [getTreeData, getTreeCurrentPath, getWorkspaceCurrentPath, getWorkspaceData],
    (treeData, treeCurrentPath, workspaceCurrentPath, workspaceData) => ({
        tree: {
            currentPath: treeCurrentPath,
            data: treeData
        },
        workspace: {
            currentPath: workspaceCurrentPath,
            data: workspaceData
        }
    })
);