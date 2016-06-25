import React, { Component } from 'react';

class Message extends Component {

    render() {
        const { text, show } = this.props;

        return (
            <div style={{display: show ? 'block' : 'none'}}>
                {text}
            </div>
        );
    }
}

export default Message;