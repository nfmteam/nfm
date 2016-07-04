import React, { Component } from 'react';

class Workspace extends Component {

    constructor(props) {
        super(props);

        this.loadWorkspaceFiles = this.loadWorkspaceFiles.bind(this);
    }

    componentWillMount() {
        const workspacePath = this.props.workspacePath;
        const loadWorkspaceFilesHandler = this.props.loadWorkspaceFilesHandler;
        const currentPath = this.props.workspace.currentPath;

        if (workspacePath !== currentPath) {
            loadWorkspaceFilesHandler(workspacePath);
        }
    }

    loadWorkspaceFiles(path) {
        const { loadWorkspaceFilesHandler, push } = this.props;

        push(`/browser/${encodeURIComponent(path)}`);
        loadWorkspaceFilesHandler(path);
    }

    render() {
        const { data, currentPath } = this.props.workspace;

        return (
            <div style={{width: 700, position: 'absolute', top: 120, left: 460 }}>
                {
                    data.map(item => {
                        return (
                            <p key={item.path}>
                                {
                                    item.type === 'd' ?
                                        <a href='javascript:;'
                                           onClick={() => this.loadWorkspaceFiles(item.path)}
                                           key={item.path}>
                                            [directory]{item.name}
                                        </a> :
                                        <a href='javascript:;'>{item.name}</a>
                                }
                            </p>
                        )
                    })
                }
            </div>
        );
    }
}

export default Workspace;