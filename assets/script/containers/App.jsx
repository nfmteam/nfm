import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Message from '../components/Message.jsx';
import selector from '../selectors/app';

class App extends Component {
    render() {
        const { message, workspaceCurrentPath, children } = this.props;

        return (
            <div>
                <ul>
                    <li>
                        <Link to='/test1'>test1</Link>
                    </li>
                    <li>
                        <Link to='/test2'>test2</Link>
                    </li>
                    <li>
                        <Link to={`/browser/${encodeURIComponent(workspaceCurrentPath)}`}>browser</Link>
                    </li>
                </ul>
                <Message message={message}/>
                {children}
            </div>
        );
    }
}

App.propTypes = {
    message: PropTypes.shape({
        text: PropTypes.string.isRequired,
        show: PropTypes.bool.isRequired
    })
};

export default connect(selector)(App);