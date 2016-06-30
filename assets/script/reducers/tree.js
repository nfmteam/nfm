import { TREE_REQUEST, TREE_REQUEST_SUCCESS } from '../constants/actionTypes';
import merge from 'lodash.merge';

const initialState = {
    currentId: '',
    data: [
        {
            id: '0',
            name: '/',
            type: 'd',
            isOpen: true,
            isLoading: true,
            children: []
        }
    ]
};

function addChild(tree, parentId, child) {
    var node;

    for (var i = 0, j = tree.length; i < j; i++) {
        node = tree[i];
        if (node.id === parentId) {
            node.isOpen = true;
            node.isLoading = false;
            node.children = child;
            break;
        } else if (node.children && node.children.length !== 0) {
            node = addChild(node.children, parentId, child);
        }
    }

    return tree;
}

function loadingTree(tree, nodeId) {
    var node;

    for (var i = 0, j = tree.length; i < j; i++) {
        node = tree[i];
        if (node.id === nodeId) {
            node.isLoading = 123123;
            break;
        } else if (node.children && node.children.length !== 0) {
            node = loadingTree(node.children, nodeId);
        }
    }

    return tree;
}

export default function treeReducer(state = initialState, action) {
    switch (action.type) {
        case TREE_REQUEST:
            return merge({}, state, {
                data: loadingTree(state.data, action.currentId)
            });
        case TREE_REQUEST_SUCCESS:
            return merge({}, state, {
                currentId: action.currentId,
                data: addChild(state.data, action.currentId, action.data)
            });
        default:
            return state;
    }
}