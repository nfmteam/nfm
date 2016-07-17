import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { getTree, controlTreeCreater } from '../actions/tree';
import { getWorkspaceFiles } from '../actions/workspace';
import { showInfoMessage, showErrorMessageCreater } from '../actions/message';
import { push } from 'react-router-redux';
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
      showInfoMessage, showErrorMessage,
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
        showInfoMessage={showInfoMessage}
        showErrorMessage={showErrorMessage}
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
  loadWorkspaceFilesHandler: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
  showInfoMessage: PropTypes.func.isRequired,
  showErrorMessage: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  loadTreeHandler: path => dispatch(getTree(path)),
  controlTreeHandler: path => dispatch(controlTreeCreater(path)),
  loadWorkspaceFilesHandler: path => dispatch(getWorkspaceFiles(path)),
  push: path => dispatch(push(`/browser/${encodeURIComponent(path)}`)),
  showInfoMessage: text => dispatch(showInfoMessage(text)),
  showErrorMessage: text => dispatch(showErrorMessageCreater(text))
});

export default connect(
  selector,
  mapDispatchToProps
)(Browser);