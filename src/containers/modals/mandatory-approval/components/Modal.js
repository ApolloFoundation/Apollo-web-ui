import React from 'react';

export default class Modal extends React.Component {
  render() {
    return (
      <div className="modal-box">
        <form className="modal-form">
          <div className="form-group-app">
            <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>
            <div className="form-title inline">
              <p>{this.props.title}</p>

            </div>
            {this.props.children}
          </div>
        </form>
      </div>
    );
  }
}
