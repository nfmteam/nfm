import React, { Component } from 'react';

class Counter extends Component {
    render() {
        const { count, addHandler, addAsyncHandler, subtractHandler, cleanHandler } = this.props;

        return (
            <div>
                <p>{count}</p>
                <button onClick={addHandler}>+1</button>
                <button onClick={addAsyncHandler}>+1 Async</button>
                <button onClick={subtractHandler}>-1</button>
                <button onClick={cleanHandler}>Clean</button>
            </div>
        );
    }
}

export default Counter;