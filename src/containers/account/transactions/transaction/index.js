import React from 'react';
import uuid from 'uuid';

class Transaction extends React.Component {
    constructor(props) {
        super(props);
    }

    render () {
        return (
            <tr key={uuid()}>
                <td className="blue-link-text">
                    <a>{this.props.transaction.blockTimestamp}</a>
                </td>
                <td>
                    {
                        this.props.transaction.attachment['version.AliasAssignment'] &&
                        'Alias assignment'
                    }
                    {
                        this.props.transaction.attachment['version.PollCreation'] &&
                        'Poll creation'
                    }
                    {
                        'version.OrdinaryPayment' in this.props.transaction.attachment &&
                        'Ordinary payment'
                    }
                    {
                        this.props.transaction.attachment['version.AccountInfo'] &&
                        'Account info'
                    }
                    {
                        this.props.transaction.attachment['version.VoteCasting'] &&
                        'Vote casting'
                    }
                </td>
                <td className="align-right">
                    {this.props.transaction.amountATM / 100000000}
                </td>
                <td className="align-right">
                    {this.props.transaction.feeATM / 100000000}
                </td>
                <td className="blue-link-text">
                    <a>{this.props.transaction.senderRS + ' -> ' + this.props.transaction.recipientRS}</a>
                </td>
                <td className="align-right">
                </td>
                <td className="align-right blue-link-text">
                    <a>{this.props.transaction.height}</a>
                </td>
                <td className="align-right">
                    <a>{this.props.transaction.confirmations}</a>
                </td>
            </tr>
        );
    }
}

export default Transaction;