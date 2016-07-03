import React, { Component } from 'react';

class Workspace extends Component {

    componentWillMount() {
        const workspacePath = this.props.workspacePath;
        const loadWorkspaceFilesHandler = this.props.loadWorkspaceFilesHandler;
        const currentPath = this.props.workspace.currentPath;

        if (workspacePath !== currentPath) {
            loadWorkspaceFilesHandler(workspacePath);
        }
    }

    render() {
        const { data, currentPath } = this.props.workspace;

        return (
            <div style={{width: 700, position: 'absolute', top: 120, left: 460 }}>
                {
                    data.map(file => {
                        return (
                            <p key={file.path}>
                                {file.type === 'd' ? '[directory]' : null}
                                {file.name}
                            </p>
                        )
                    })
                }
            </div>
        );
    }
}

export default Workspace;