import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Message from '../components/Message.jsx';
import Loadingbar from '../components/Loadingbar.jsx';
import Header from '../components/Header.jsx';
import selector from '../selectors/app';

class App extends Component {

    render() {
        const { message, loading, workspaceCurrentPath, children } = this.props;

        return (
            <div>
                <Loadingbar loading={loading} />
                <Header />
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