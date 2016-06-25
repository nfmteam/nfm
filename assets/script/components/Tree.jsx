import React, { Component } from 'react';

class Tree extends Component {

    componentWillMount() {
        this.props.loadTreeHandler();
    }

    renderTree(data) {
        let itemHtml;

        return data.map(item => {
            return <li key={item.id}>
                <a href='javascript:;' onClick={() => this.props.loadTreeHandler(item.path)}>{item.name}</a>
            </li>
        });
    }

    render() {
        const {
            tree: {
                data: data,
                loading: loading
            },
            loadTreeHandler
        } = this.props;

        let html = loading ? 'loading...' : data.map(item =>
            <li key={item.id}>
                <a href='javascript:;' onClick={() => loadTreeHandler(item.path)}>{item.name}</a>
            </li>
        );

        return (
            <ul>
                {html}
            </ul>
        );
    }
}

export default Tree;