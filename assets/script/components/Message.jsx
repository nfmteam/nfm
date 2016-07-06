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
            'page-prompt-info': level === 'info',
            'page-prompt-close': !show
        });

        return (
            <div className={cls}>
                <div className='alert'>
                    <button type='button' className='close' onClick={() => hideMessage()}>×</button>
                    <span>{text}</span>
                </div>
            </div>
        );
    }
}

export default Message;