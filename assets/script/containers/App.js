import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { addCount, addCountAsync, subtractCount, cleanCount } from '../actions/counter';
import Counter from '../components/Counter';

class App extends Component {
    render() {
        const { dispatch, count } = this.props;

        return (
            <Counter
                addHandler={() => dispatch(addCount())}
                addAsyncHandler={() => dispatch(addCountAsync())}
                subtractHandler={() => dispatch(subtractCount())}
                cleanHandler={() => dispatch(cleanCount())}
                count={count}/>
        );
    }
}

App.propTypes = {
    dispatch: PropTypes.func.isRequired,
    count: PropTypes.number.isRequired
};

function select(state) {
    return {
        count: state.count
    };
}

export default connect(select)(App);