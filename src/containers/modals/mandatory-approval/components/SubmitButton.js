import React from "react";

export default class SubmitButton extends React.Component {
    render() {
        return (
            <a className="btn btn-right round round-top-left round-bottom-right"
               onClick={() => this.props.submit()}
            >
                Submit
            </a>
        );
    }
}