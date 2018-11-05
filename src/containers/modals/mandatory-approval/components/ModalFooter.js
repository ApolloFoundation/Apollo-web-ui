import React from "react";

export default class ModalFooter extends  React.Component {
    render() {
        return (
            <div className="btn-box align-buttons-inside absolute right-conner">
                {this.props.children}
            </div>
        )
    }
}