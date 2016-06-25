import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { addCount, addCountAsync, subtractCount, cleanCount } from '../actions/counter';
import { getTree } from '../actions/tree';
import Counter from '../components/Counter.jsx';
import Tree from '../components/Tree.jsx';
import Message from '../components/Message.jsx';

class App extends Component {
    render() {
        const { dispatch, count, tree, message } = this.props;

        return (
            <div>
                <Message message={message} />
                <Counter
                    addHandler={() => dispatch(addCount())}
                    addAsyncHandler={() => dispatch(addCountAsync())}
                    subtractHandler={() => dispatch(subtractCount())}
                    cleanHandler={() => dispatch(cleanCount())}
                    count={count} />
                <Tree
                    tree = {tree}
                    loadTreeHandler={() => dispatch(getTree())} />
            </div>
        );
    }
}

App.propTypes = {
    dispatch: PropTypes.func.isRequired,
    tree: PropTypes.shape({
        data: PropTypes.array.isRequired,
        loading: PropTypes.bool.isRequired
    }),
    message: PropTypes.shape({
        text: PropTypes.string.isRequired,
        show: PropTypes.bool.isRequired
    }),
    count: PropTypes.number.isRequired
};

function select(state) {
    return {
        count: state.counter.count,
        tree: {
            data: state.tree.data,
            loading: state.tree.loading
        }
    };
}

export default connect(select)(App);