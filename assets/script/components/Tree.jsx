import React, { Component } from 'react';

class Tree extends Component {

    componentWillMount() {
        this.props.loadTreeHandler();
    }

    renderTree(data, index) {
        var itemHtml;

        return <div style={{paddingLeft: 10 * index}}>
            {data.map((item, i) => {
                itemHtml = <a href='javascript:;' onClick={() => this.props.loadTreeHandler(item.path)}>{item.name}</a>
                return <div key={item.id}>
                    {item.children ? this.renderTree(item.children, i) : itemHtml}
                </div>
            })}
        </div>
    }

    render() {
        const {
            tree: {
                data: data,
                loading: loading
            }
        } = this.props;

        let html = loading ? 'loading...' : this.renderTree(data, 0);

        return <div style={{margin: 30}}>{html}</div>;
    }
}

export default Tree;