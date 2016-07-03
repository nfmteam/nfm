import React, { Component } from 'react';
import { push } from 'react-router-redux';
import classNames from 'classnames';

class SubTree extends Component {

    constructor(props) {
        super(props);

        this.controlTree = this.controlTree.bind(this);
        this.loadWorkspace = this.loadWorkspace.bind(this);
    }

    controlTree(event, node) {
        if (node.loaded && node.children && node.children.length) {
            this.props.controlTreeHandler(node.path);
        }

        if (!node.loaded) {
            this.props.loadTreeHandler(node.path);
        }

        event.stopPropagation();
    }

    loadWorkspace(event, node) {
        var path = encodeURIComponent(node.path),
            push = this.props.push,
            loadWorkspaceFilesHandler = this.props.loadWorkspaceFilesHandler;

        push(`/browser/${path}`);
        loadWorkspaceFilesHandler(node.path);

        event.stopPropagation();
    }

    render() {
        const { data, ...otherProps } = this.props;

        if (Object.prototype.toString.call(data) !== '[object Array]' || !data.length) {
            return null;
        }

        return (
            <ul className='tree'>
                {
                    data.map(node => {
                        let { name, path, isOpen, isLoading, loaded, children } = node;

                        let liClass = classNames({
                            'tree-open': isOpen,
                            'tree-loading': isLoading,
                            'tree-none': loaded && (!children || !children.length)
                        });

                        return (
                            <li className={liClass} key={path}>
                                <span
                                    className='tree-switcher tree-noline-open'
                                    onClick={event => this.controlTree(event, node)} />
                                <a href='javascript:;' onClick={event => this.loadWorkspace(event, node)}>
                                    <i className='tree-icon tree-icon-open'/>
                                    <span className='tree-title'>{name}</span>
                                </a>
                                <SubTree data={children} {...otherProps} />
                            </li>
                        );
                    })
                }
            </ul>
        );
    }
}

class Tree extends Component {

    componentWillMount() {
        const root = this.props.tree.data[0];
        const loadTreeHandler = this.props.loadTreeHandler;

        // 初始化时, 加载树
        if (!root.loaded) {
            loadTreeHandler();
        }
    }

    render() {
        const {
            tree: {
                data: data
            },
            ...otherProps
        } = this.props;

        return (
            <div style={{width: 400, position: 'absolute', top: 120, left: 30 }}>
                <SubTree data={data} {...otherProps}/>
            </div>
        );
    }
}

export default Tree;