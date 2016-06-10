import React, { Component, PropTypes } from 'react';
import { addCount, subtractCount, cleanCount } from '../actions/counter';
import { connect } from 'react-redux';

class App extends Component {
    render() {
        const { dispatch, count } = this.props;

        return (
            <div>
                <p>{count}</p>
                <button onClick={() => dispatch(addCount())}>+1</button>
                <button onClick={() => dispatch(subtractCount())}>-1</button>
                <button onClick={() => dispatch(cleanCount())}>Clean</button>
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
        count: state.count
    };
}

export default connect(select)(App);