import React, { Component } from 'react';
import Tree, { TreeNode } from 'rc-tree';

class TreeComponent extends Component {

    componentWillMount() {
        this.props.loadTreeHandler();
    }

    renderTree(data) {
        return data.map(item => {
            return <TreeNode title={item.name} key={item.id}>
                {item.children ? this.renderTree(item.children) : null}
            </TreeNode>
        });
    }

    render() {
        const {
            tree: {
                data: data,
                loading: loading
            }
        } = this.props;

        let html = loading ? 'loading...' : <Tree showLine defaultExpandedKeys={['0']}>
            <TreeNode title={data.name} key={data.id}>
                {data.children ? this.renderTree(data.children) : null}
            </TreeNode>
        </Tree>;

        return <div style={{margin: 30}}>{html}</div>;
    }
}

export default TreeComponent;