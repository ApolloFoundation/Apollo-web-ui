import React from 'react';

export default class ModalFooter extends React.Component {
  render() {
    return (
      <div className="btn-box right-conner align-right form-footer">
        {this.props.children}
      </div>
    );
  }
}
