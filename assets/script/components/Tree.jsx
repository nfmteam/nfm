import React, { Component } from 'react';
import classNames from 'classnames/bind';

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
                data.map(({ id, name, path, isOpen, isLoading, children }) => {

                    let liClass = classNames({
                        'tree-open': isOpen,
                        'tree-loading': isLoading
                    });

                    return <li className={liClass} key={id}
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
                data: data
            },
            loadTreeHandler
        } = this.props;

        return <div style={{margin: 30}}>
            <SubTree data={data} loadTreeHandler={loadTreeHandler}/>
        </div>;
    }
}

export default Tree;