import React, { Component } from 'react';

class Tree extends Component {

    componentWillMount() {
        this.props.loadTreeHandler();
    }

    render() {
        const { data, loading } = this.props.tree;
        let html  = loading ? 'loading...': data.map(item =>
            <li key={item.id}>{item.name}</li>
        );

        return (
            <ul>
                {html}
            </ul>
        );
    }
}

export default Tree;