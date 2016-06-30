import React, { Component } from 'react';

class SubTree extends Component {

    constructor(props) {
        super(props);
        this.loadSubTree = this.loadSubTree.bind(this);
    }

    loadSubTree(event, path, id) {
        this.props.loadTreeHandler(path, id);
        event.stopPropagation();
    }

    render() {
        const { data, ...otherProps } = this.props;

        if (!data || data.length === 0) {
            return null;
        }

        return <ul className='tree'>
            {
                data.map(({ id, name, path, isOpen, children }) => {
                    return <li
                        className={isOpen ? 'tree-open' : null}
                        key={id}
                        onClick={event => this.loadSubTree(event, path, id)}>
                        <span className='tree-switcher tree-noline-open'/>
                        <a href='javascript:;'>
                            <i className='tree-icon tree-icon-open'/>
                            <span className='tree-title'>{name}</span>
                        </a>
                        <SubTree data={children} {...otherProps} />
                    </li>
                })
            }
        </ul>
    }
}

class Tree extends Component {

    componentWillMount() {
        this.props.loadTreeHandler();
    }

    render() {
        const {
            tree: {
                data: data,
                loading: loading
            }
        } = this.props;

        let html = loading ? 'loading...' :
            <SubTree data={data} loadTreeHandler={this.props.loadTreeHandler}/>;

        return <div style={{margin: 30}}>{html}</div>;
    }
}

export default Tree;