import React from "react";

export default class CancelButton extends React.Component {
    render() {
        return (
            <button
                type={'button'}
                className="btn btn-right round round-top-left"
                onClick={() => this.props.close()}
            >
                Cancel
            </button>
        );
    }
}