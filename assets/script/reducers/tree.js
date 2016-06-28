import { TREE_REQUEST, TREE_REQUEST_SUCCESS } from '../constants/actionTypes';
import TreeModel from 'tree-model';

let tree = new TreeModel();
let treeRoot;
let initialState;

function getInitialState() {
    const initialState = {
        loading: false,
        currentId: 0,
        data: null
    };
    const rootTree = {
        id: 0,
        name: '/',
        type: 'd',
        children: []
    };

    var treeModel = new TreeModel();
    treeRoot = treeModel.parse(rootTree);

    initialState.data = treeRoot.model;

    return initialState;
}

export default function treeReducer(state, action) {
    switch (action.type) {
        case TREE_REQUEST:
            return Object.assign({}, state, {
                loading: true
            });
        case TREE_REQUEST_SUCCESS:
            let currentNode = treeRoot.first(node => node.model.id === state.currentId);
            let node;

            action.data.forEach(item => {
                node = tree.parse(item);
                currentNode.addChild(node);
            });

            return {
                loading: false,
                currentId: action.currentId,
                data: treeRoot.model
            };
        default:
            if (!initialState) {
                initialState = getInitialState();
            }
            return initialState;
    }
}