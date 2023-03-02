import React, {Component} from "react";
import { bigIntDivision, bigIntFormat } from "helpers/util/bigNumberWrappers";

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
                    <td>{bigIntFormat(bigIntDivision(atch.priceATM, this.props.decimals))}</td>
                </tr>
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
