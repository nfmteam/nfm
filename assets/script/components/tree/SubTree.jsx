import React, { Component } from 'react';
import classNames from 'classnames';

export default class SubTree extends Component {

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
    this.props.push(node.path);

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
                <i onClick={event => this.controlTree(event, node)}/>
                <a href='javascript:;' onClick={event => this.loadWorkspace(event, node)}>
                  <i/>
                  <span>{name}</span>
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