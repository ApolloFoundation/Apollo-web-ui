import React from 'react';
// TODO remove
export default class CancelButton extends React.Component {
  render() {
    return (
      <button
        type="button"
        className="btn btn-default mr-3"
        onClick={() => this.props.close()}
      >
        Cancel
      </button>
    );
  }
}
