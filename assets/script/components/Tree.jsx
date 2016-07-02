import React, { Component } from 'react';
import { browserHistory } from 'react-router'
import classNames from 'classnames';

class SubTree extends Component {

    constructor(props) {
        super(props);
        this.clickTree = this.clickTree.bind(this);
    }

    clickTree(event, node) {
        if (node.loaded && node.children && node.children.length) {
            this.props.controlTreeHandler(node.id);
        }

        if (!node.loaded) {
            this.props.loadTreeHandler(node.path, node.id);
        }

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
                        let { id, name, path, isOpen, isLoading, loaded, children } = node;

                        let liClass = classNames({
                            'tree-open': isOpen,
                            'tree-loading': isLoading,
                            'tree-none': loaded && (!children || !children.length)
                        });

                        return (
                            <li className={liClass} key={id}
                                onClick={event => this.clickTree(event, node)}>
                                <span className='tree-switcher tree-noline-open'/>
                                <a href='javascript:;'>
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
        const currentId = this.props.tree.currentId;
        const loadTreeHandler = this.props.loadTreeHandler;

        if (currentId === '') {
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