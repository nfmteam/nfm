import React, { Component } from 'react';
import SubTree from './SubTree.jsx';

export default class Tree extends Component {

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
      <aside className='main-sidebar'>
        <section className='sidebar'>
          <div className='menu-tree'>
            <SubTree data={data} {...otherProps}/>
          </div>
        </section>
      </aside>
    );
  }
}