import React, { Component, PropTypes } from 'react';

class Tree extends Component {

    componentWillMount() {
        this.props.loadTreeHandler();
    }

    render() {
        const { treeData } = this.props;
        return (
            <ul>
                {treeData.map(item => <li key={item.id}>{item.name}</li>)}
            </ul>
        );
    }
}

Tree.propTypes = {
    treeData: PropTypes.array.isRequired,
    loadTreeHandler: PropTypes.func.isRequired
};

export default Tree;