import merge from 'lodash.merge';
import {
    TREE_REQUEST,
    TREE_REQUEST_SUCCESS,
    TREE_CONTROL
} from '../constants/actionTypes';

const initialState = {
    currentId: '',
    data: [
        {
            id: '0',
            name: '/',
            type: 'd',
            isOpen: true,
            loaded: false,
            isLoading: true,
            children: []
        }
    ]
};

function walk(tree, nodeId, fn) {
    var node;

    for (var i = 0, j = tree.length; i < j; i++) {
        node = tree[i];
        if (node.id === nodeId) {
            fn(node);
            break;
        } else if (node.children && node.children.length !== 0) {
            node = walk(node.children, nodeId, fn);
        }
    }

    return tree;
}

function addChild(tree, nodeId, child) {
    console.log(arguments);
    return walk(tree, nodeId, (node) => {
        node.isOpen = true;
        node.loaded = true;
        node.isLoading = false;
        node.children = child;
    });
}

function loadingTree(tree, nodeId) {
    return walk(tree, nodeId, (node) => {
        node.isLoading = true;
    });
}

function controlTree(tree, nodeId) {
    return walk(tree, nodeId, (node) => {
        node.isOpen = !node.isOpen;
    });
}

export default function treeReducer(state = initialState, action) {
    switch (action.type) {
        case TREE_REQUEST:
            return merge({}, state, {
                currentId: action.currentId,
                data: loadingTree(state.data, action.currentId)
            });
        case TREE_REQUEST_SUCCESS:
            return merge({}, state, {
                currentId: action.currentId,
                data: addChild(state.data, action.currentId, action.data)
            });
        case TREE_CONTROL:
            return merge({}, state, {
                currentId: action.currentId,
                data: controlTree(state.data, action.currentId)
            });
        default:
            return state;
    }
}