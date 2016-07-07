import React, { Component } from 'react';
import classNames from 'classnames';

class Message extends Component {

    render() {
        const {
            message: {
                text: text,
                show: show,
                level: level
            },
            hideMessage
        } = this.props;

        const cls = classNames({
            'page-prompt': true,
            'page-prompt-show': show,
            'callout': true,
            'callout-danger': level === 'Error',
            'callout-info': level === 'Info'
        });

        return (
            <div className={cls} onClick={() => hideMessage()}>
                <h4>{level}</h4>
                <p>{text}</p>
            </div>
        );
    }
}

export default Message;