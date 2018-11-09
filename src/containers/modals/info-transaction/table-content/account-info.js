import React, {Component} from "react";

export default class AccountInfo extends Component {
    render() {
        const attachment = this.props.transaction.attachment || {};
        console.log("yayaya", this.props.transaction);
        return (
            <React.Fragment>
                {attachment.name &&
                <tr>
                    <td>Name:</td>
                    <td>{attachment.name}</td>
                </tr>
                }
                {attachment.description &&
                <tr>
                    <td>Description:</td>
                    <td>{attachment.description}</td>
                </tr>
                }
                {attachment.messageIsText ?
                <tr>
                    <td>Public Message:</td>
                    <td rowSpan="3">{attachment.message}</td>
                </tr> : null
                }
            </React.Fragment>
        );
    }
}