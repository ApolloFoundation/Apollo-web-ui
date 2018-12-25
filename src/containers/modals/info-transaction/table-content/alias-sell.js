import React, {Component} from "react";

export default class AliasSell extends Component {
    render() {
        const atch = this.props.transaction.attachment;
        return (
            <React.Fragment>
                <tr>
                    <td>Alias Name:</td>
                    <td>{atch.alias}</td>
                </tr>
                <tr>
                    <td>Price:</td>
                    <td>{atch.priceATM / Math.pow(10, 8)}</td>
                </tr>
                {
                    this.props.transaction.attachment.message && 
                    <tr>
                        <td>Public Messgae:</td>
                        <td>{this.props.transaction.attachment.message}</td>
                    </tr>
                }
                
                <tr>
                    <td>Recipient:</td>
                    <td>{this.props.transaction.recipientRS}</td>
                </tr>
                <tr>
                    <td>Sender:</td>
                    <td>{this.props.transaction.senderRS}</td>
                </tr>
            </React.Fragment>
        );
    }
}