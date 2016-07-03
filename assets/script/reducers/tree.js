import merge from 'lodash.merge';
import {
    TREE_REQUEST,
    TREE_REQUEST_SUCCESS,
    TREE_CONTROL
} from '../constants/actionTypes';

const initialState = {
    currentPath: '',
    data: [
        {
            path: '/',
            name: '/',
            type: 'd',
            isOpen: true,
            loaded: false,
            isLoading: true,
            children: []
        }
    ]
};

function walk(tree, nodePath, fn) {
    var node;

    for (var i = 0, j = tree.length; i < j; i++) {
        node = tree[i];
        if (node.path === nodePath) {
            fn(node);
            break;
        } else if (node.children && node.children.length !== 0) {
            node = walk(node.children, nodePath, fn);
        }
    }

    return tree;
}

function addChild(tree, nodePath, child) {
    return walk(tree, nodePath, (node) => {
        node.isOpen = true;
        node.loaded = true;
        node.isLoading = false;
        node.children = child;
    });
}

function loadingTree(tree, nodePath) {
    return walk(tree, nodePath, (node) => {
        node.isLoading = true;
    });
}

function controlTree(tree, nodePath) {
    return walk(tree, nodePath, (node) => {
        node.isOpen = !node.isOpen;
    });
}

export default function treeReducer(state = initialState, action) {
    switch (action.type) {
        case TREE_REQUEST:
            return merge({}, state, {
                currentPath: action.currentPath,
                data: loadingTree(state.data, action.currentPath)
            });
        case TREE_REQUEST_SUCCESS:
            return merge({}, state, {
                currentPath: action.currentPath,
                data: addChild(state.data, action.currentPath, action.data)
            });
        case TREE_CONTROL:
            return merge({}, state, {
                currentPath: action.currentPath,
                data: controlTree(state.data, action.currentPath)
            });
        default:
            return state;
    }
}