import { TREE_REQUEST, TREE_REQUEST_SUCCESS } from '../constants/actionTypes';

const initialState = {
    loading: false,
    currentId: '0',
    data: [
        {
            id: '0',
            name: '/',
            type: 'd',
            isOpen: true,
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
            node.children = child;
            break;
        } else if (node.children && node.children.length !== 0) {
            node = addChild(node.children, parentId, child);
        }
    }

    return tree;
}

export default function treeReducer(state = initialState, action) {
    switch (action.type) {
        case TREE_REQUEST:
            return Object.assign({}, state, {
                loading: true
            });
        case TREE_REQUEST_SUCCESS:
            var data = addChild(state.data, action.currentId, action.data);

            return {
                loading: false,
                currentId: action.currentId,
                data: data
            };
        default:
            return state;
    }
}