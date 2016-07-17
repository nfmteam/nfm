import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { hideMessageCreater } from '../actions/message';
import Message from '../components/Message.jsx';
import Loadingbar from '../components/Loadingbar.jsx';
import Header from '../components/Header.jsx';
import selector from '../selectors/app';

class App extends Component {

  render() {
    const { message, loading, hideMessage, children } = this.props;

    return (
      <div>
        <Loadingbar loading={loading}/>
        <Message message={message} hideMessage={hideMessage}/>
        <Header />
        {children}
      </div>
    );
  }

}

App.propTypes = {
  loading: PropTypes.bool.isRequired,
  message: PropTypes.shape({
    text: PropTypes.string,
    level: PropTypes.string,
    show: PropTypes.bool.isRequired
  }),
  hideMessage: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  hideMessage: path => dispatch(hideMessageCreater())
});

export default connect(
  selector,
  mapDispatchToProps
)(App);