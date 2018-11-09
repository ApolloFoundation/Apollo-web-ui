import React, {Component} from "react";

export default class PhasingVoteCasting extends Component {
    renderHashes = hashes => hashes.map((hash, index) => <tr>
        <td>Hash {index}:</td>
        <td>{hash}</td>
    </tr>);

    render() {
        const atch = this.props.transaction.attachment;
        return (
            <React.Fragment>
                {this.renderHashes(atch.transactionFullHashes)}
                <tr>
                    <td>Sender:</td>
                    <td>{this.props.transaction.senderRS}</td>
                </tr>
            </React.Fragment>
        );
    }
}