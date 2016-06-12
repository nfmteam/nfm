import React, { Component, PropTypes } from 'react';

class Counter extends Component {
    render() {
        const { count, addHandler, subtractHandler, cleanHandler } = this.props;

        return (
            <div>
                <p>{count}</p>
                <button onClick={addHandler}>+1</button>
                <button onClick={subtractHandler}>-1</button>
                <button onClick={cleanHandler}>Clean</button>
            </div>
        );
    }
}

Counter.propTypes = {
    count: PropTypes.number.isRequired,
    addHandler: PropTypes.func.isRequired,
    subtractHandler: PropTypes.func.isRequired,
    cleanHandler: PropTypes.func.isRequired
};

export default Counter;