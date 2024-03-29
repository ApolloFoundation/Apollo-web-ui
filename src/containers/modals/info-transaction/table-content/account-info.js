import React, {Component} from "react";

export default class AccountInfo extends Component {
    render() {
        const attachment = this.props.transaction.attachment || {};
        return (
            <React.Fragment>
                {
                    attachment.name &&
                    <tr>
                        <td>Name:</td>
                        <td>{attachment.name}</td>
                    </tr>
                }
                {
                    attachment.description &&
                    <tr>
                        <td>Description:</td>
                        <td>{attachment.description}</td>
                    </tr>
                }
            </React.Fragment>
        );
    }
}
