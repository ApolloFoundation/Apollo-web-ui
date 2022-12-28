import React from 'react';
// TODO remove

export default class Modal extends React.Component {
  render() {
    return (
      <div className="modal-box">
        <form className="modal-form">
          <div className="form-group-app">
            <button type="button" onClick={this.props.closeModal} className="exit"><i className="zmdi zmdi-close" /></button>
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
