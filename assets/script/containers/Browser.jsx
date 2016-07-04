import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { addCount, addCountAsync, subtractCount, cleanCount } from '../actions/counter';
import { getTree, controlTree } from '../actions/tree';
import { getWorkspaceFiles } from '../actions/workspace';
import Counter from '../components/Counter.jsx';
import Tree from '../components/Tree.jsx';
import Workspace from '../components/Workspace.jsx';
import Search from '../components/Search.jsx';
import selector from '../selectors/browser';

class Browser extends Component {
    render() {
        const {
            count, tree, workspace,
            addHandler, addAsyncHandler, subtractHandler, cleanHandler,
            loadTreeHandler, controlTreeHandler, push,
            loadWorkspaceFilesHandler,
            params: {
                workspacePath: workspacePath,
                keyword: keyword
            }
        } = this.props;

        let subComponent = null;

        if (workspacePath) {
            subComponent = <Workspace
                workspace={workspace}
                workspacePath={workspacePath}
                push={push}
                loadWorkspaceFilesHandler={loadWorkspaceFilesHandler}/>
        } else if (keyword) {
            subComponent = <Search keyword={keyword}/>
        }

        return (
            <div>
                <Counter
                    addHandler={addHandler}
                    addAsyncHandler={addAsyncHandler}
                    subtractHandler={subtractHandler}
                    cleanHandler={cleanHandler}
                    count={count}/>
                <Tree
                    tree={tree}
                    push={push}
                    loadTreeHandler={loadTreeHandler}
                    controlTreeHandler={controlTreeHandler}
                    loadWorkspaceFilesHandler={loadWorkspaceFilesHandler}/>
                {subComponent}
            </div>
        );
    }
}

Browser.propTypes = {
    tree: PropTypes.shape({
        currentPath: PropTypes.string.isRequired,
        data: PropTypes.array.isRequired
    }),
    workspace: PropTypes.shape({
        currentPath: PropTypes.string.isRequired,
        data: PropTypes.array.isRequired
    }),
    count: PropTypes.number.isRequired,
    addHandler: PropTypes.func.isRequired,
    addAsyncHandler: PropTypes.func.isRequired,
    subtractHandler: PropTypes.func.isRequired,
    cleanHandler: PropTypes.func.isRequired,
    loadTreeHandler: PropTypes.func.isRequired,
    controlTreeHandler: PropTypes.func.isRequired,
    loadWorkspaceFilesHandler: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
    addHandler: () => dispatch(addCount()),
    addAsyncHandler: () => dispatch(addCountAsync()),
    subtractHandler: () => dispatch(subtractCount()),
    cleanHandler: () => dispatch(cleanCount()),
    loadTreeHandler: path => dispatch(getTree(path)),
    controlTreeHandler: path => dispatch(controlTree(path)),
    loadWorkspaceFilesHandler: path => dispatch(getWorkspaceFiles(path))
});

export default connect(
    selector,
    mapDispatchToProps
)(Browser);