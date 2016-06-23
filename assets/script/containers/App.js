import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { addCount, addCountAsync, subtractCount, cleanCount } from '../actions/counter';
import { getTree } from '../actions/tree';
import Counter from '../components/Counter';
import Tree from '../components/Tree';

class App extends Component {
    render() {
        const { dispatch, count, treeData } = this.props;

        return (
            <div>
                <Counter
                    addHandler={() => dispatch(addCount())}
                    addAsyncHandler={() => dispatch(addCountAsync())}
                    subtractHandler={() => dispatch(subtractCount())}
                    cleanHandler={() => dispatch(cleanCount())}
                    count={count}/>
                <Tree
                    treeData = {treeData}
                    loadTreeHandler={() => dispatch(getTree())}/>
            </div>
        );
    }
}

App.propTypes = {
    dispatch: PropTypes.func.isRequired,
    count: PropTypes.number.isRequired
};

function select(state) {
    return {
        count: state.counter.count,
        treeData: state.tree.data
    };
}

export default connect(select)(App);