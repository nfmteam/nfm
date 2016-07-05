import React, { Component } from 'react';

class Nav extends Component {

    formatPath(path) {
        let navPath, navName, index = 0, objs = [{
            navPath: '/',
            navName: '/'
        }];

        if (path === '/') {
            return objs;
        }

        let paths = path.substr(1).split('/');
        for (let i = 0, j = paths.length; i < j; i++) {
            navName = paths[i];
            index = path.indexOf(navName, index) + navName.length;
            navPath = path.slice(0, index);

            objs.push({
                navPath,
                navName
            });
        }

        return objs;
    }

    render() {
        const { path, clickHandler } = this.props;
        const paths = this.formatPath(path);
        const lastIndex = paths.length - 1;

        return (
            <p>
                {
                    paths.map((obj, index) => {
                        return lastIndex !== index ?
                            <span key={obj.navPath}>
                                <a href='javascript:;' onClick={() => clickHandler(obj.navPath)}>
                                    {obj.navName}
                                </a>
                                <i> > </i>
                            </span>
                            :
                            <span key={obj.navPath}>{obj.navName}</span>
                    })
                }
            </p>
        );
    }
}

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

export default Workspace;