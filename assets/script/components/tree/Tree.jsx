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
            <div style={{width: 400, position: 'absolute', top: 120, left: 30 }}>
                <SubTree data={data} {...otherProps}/>
            </div>
        );
    }
}