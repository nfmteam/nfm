import React, { Component, PropTypes } from 'react';

class Tree extends Component {

    componentWillMount() {
        this.props.loadTreeHandler();
    }

    render() {
        const { treeData } = this.props;
        return (
            <div>
                {treeData.map(item => <p>{item.name}</p>)}
            </div>
        );
    }
}

Tree.propTypes = {
    treeData: PropTypes.array.isRequired,
    loadTreeHandler: PropTypes.func.isRequired
};

export default Tree;