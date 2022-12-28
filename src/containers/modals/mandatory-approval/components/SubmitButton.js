import React from "react";
// TODO remove

export default class SubmitButton extends React.Component {
    render() {
        return (
            <button
                type="submit"
                className="btn btn-right btn-green submit-button"
                onClick={() => this.props.submit()}
            >
                {this.props.text ? this.props.text : "Submit"}
            </button>
        );
    }
}