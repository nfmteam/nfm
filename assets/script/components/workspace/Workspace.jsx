import React, { Component } from 'react';
import Nav from './Nav.jsx';

export default class Workspace extends Component {

    componentWillMount() {
        const workspacePath = this.props.workspacePath;
        const loadWorkspaceFilesHandler = this.props.loadWorkspaceFilesHandler;
        const currentPath = this.props.workspace.currentPath;

        if (workspacePath !== currentPath) {
            loadWorkspaceFilesHandler(workspacePath);
        }
    }

    render() {
        const {
            workspace: {
                data: data,
                currentPath: currentPath
            },
            loadWorkspaceFilesHandler
        } = this.props;

        return (
            <div style={{width: 700, position: 'absolute', top: 120, left: 460 }}>
                <Nav path={currentPath} clickHandler={loadWorkspaceFilesHandler}/>
                {
                    data.map(item => {
                        return (
                            <p key={item.path}>
                                {
                                    item.type === 'd' ?
                                        <a href='javascript:;'
                                           onClick={() => loadWorkspaceFilesHandler(item.path)}
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