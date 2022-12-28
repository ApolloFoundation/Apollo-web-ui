import React from 'react';
import classNames from 'classnames';
// TODO remove

export default class Tab extends React.Component {
  render() {
    return (
      <div
        className={classNames({
          'tab-body': true,
          active: this.props.active,
        })}
      >
        <div className="form-tab">
          {this.props.children}
        </div>
      </div>
    );
  }
}
