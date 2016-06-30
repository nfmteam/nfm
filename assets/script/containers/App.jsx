import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { addCount, addCountAsync, subtractCount, cleanCount } from '../actions/counter';
import { getTree, controlTree } from '../actions/tree';
import Counter from '../components/Counter.jsx';
import Tree from '../components/Tree.jsx';
import Message from '../components/Message.jsx';
import selector from '../selectors';

class App extends Component {
    render() {
        const {
            count, tree, message,
            addHandler, addAsyncHandler, subtractHandler, cleanHandler,
            loadTreeHandler, controlTreeHandler
        } = this.props;

        return (
            <div>
                <Message message={message}/>
                <Counter
                    addHandler={addHandler}
                    addAsyncHandler={addAsyncHandler}
                    subtractHandler={subtractHandler}
                    cleanHandler={cleanHandler}
                    count={count}/>
                <Tree
                    tree={tree}
                    loadTreeHandler={loadTreeHandler}
                    controlTreeHandler={controlTreeHandler}/>
            </div>
        );
    }
}

App.propTypes = {
    tree: PropTypes.shape({
        currentId: PropTypes.string.isRequired,
        data: PropTypes.array.isRequired
    }),
    message: PropTypes.shape({
        text: PropTypes.string.isRequired,
        show: PropTypes.bool.isRequired
    }),
    count: PropTypes.number.isRequired,
    addHandler: PropTypes.func.isRequired,
    addAsyncHandler: PropTypes.func.isRequired,
    subtractHandler: PropTypes.func.isRequired,
    cleanHandler: PropTypes.func.isRequired,
    loadTreeHandler: PropTypes.func.isRequired,
    controlTreeHandler: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
    addHandler: () => dispatch(addCount()),
    addAsyncHandler: () => dispatch(addCountAsync()),
    subtractHandler: () => dispatch(subtractCount()),
    cleanHandler: () => dispatch(cleanCount()),
    loadTreeHandler: (path, id) => dispatch(getTree(path, id)),
    controlTreeHandler: id=>dispatch(controlTree(id))
});

export default connect(
    selector,
    mapDispatchToProps
)(App);