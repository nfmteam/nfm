import React, { Component } from 'react';
import classNames from 'classnames';

export default class Loadingbar extends Component {
  render() {
    const cls = classNames({
      'loadingbar ': true,
      'waiting': this.props.loading,
      'end': !this.props.loading
    });

    return (
      <div className={cls}>
        <dt />
        <dd />
      </div>
    );
  }
}