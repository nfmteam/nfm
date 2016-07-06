import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { getTree, controlTreeCreater } from '../actions/tree';
import { getWorkspaceFiles } from '../actions/workspace';
import Tree from '../components/tree';
import Workspace from '../components/workspace';
import Footer from '../components/Footer.jsx';
import Search from '../components/Search.jsx';
import selector from '../selectors/browser';

class Browser extends Component {
    render() {
        const {
            tree, workspace,
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
                <Tree
                    tree={tree}
                    push={push}
                    loadTreeHandler={loadTreeHandler}
                    controlTreeHandler={controlTreeHandler}
                    loadWorkspaceFilesHandler={loadWorkspaceFilesHandler}/>
                {subComponent}
                <Footer />
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
    loadTreeHandler: PropTypes.func.isRequired,
    controlTreeHandler: PropTypes.func.isRequired,
    loadWorkspaceFilesHandler: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
    loadTreeHandler: path => dispatch(getTree(path)),
    controlTreeHandler: path => dispatch(controlTreeCreater(path)),
    loadWorkspaceFilesHandler: path => dispatch(getWorkspaceFiles(path))
});

export default connect(
    selector,
    mapDispatchToProps
)(Browser);