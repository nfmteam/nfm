import React, { Component } from 'react';

class Message extends Component {

    render() {
        const { text, show } = this.props.message;

        return (
            <div style={{display: show ? 'block' : 'none'}}>
                <p>{text}</p>
            </div>
        );
    }
}

export default Message;