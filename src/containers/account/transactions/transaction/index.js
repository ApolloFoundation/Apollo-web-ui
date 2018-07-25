import React from 'react';
import uuid from 'uuid';
import crypto from '../../../../helpers/crypto/crypto'
import converters from '../../../../helpers/converters';

class Transaction extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            transaction: this.props.transaction
        }
    }

    componentWillMount() {
        if (this.props.transaction.encryptedTransaction) {
            var options = {
                publicKey  :  converters.hexStringToByteArray(this.props.publicKey),
                privateKey :  converters.hexStringToByteArray(this.props.privateKey),
            };

            options.sharedKey = this.props.sharedKey;

            var decrypted =  crypto.decryptData(this.props.transaction.encryptedTransaction, options);
            decrypted = decrypted.message;

            decrypted = converters.hexStringToString(decrypted);
            decrypted = decrypted.slice(0, decrypted.lastIndexOf('}') + 1);
            decrypted = JSON.parse(decrypted);

            this.setState({
                transaction: decrypted
            })
        }
    }

    render () {
        console.log(this.state.transaction.transaction);
        if (!this.state.transaction.encryptedTransaction) {
            return (
                <tr key={uuid()}>
                    <td className="blue-link-text">
                        <a onClick={this.props.setTransactionInfo.bind(this, 'INFO_TRANSACTION', this.state.transaction.transaction)}>{this.state.transaction.blockTimestamp}</a>
                    </td>
                    <td>
                        {
                            this.state.transaction.attachment['version.AliasAssignment'] &&
                            'Alias assignment'
                        }
                        {
                            this.state.transaction.attachment['version.PollCreation'] &&
                            'Poll creation'
                        }
                        {
                            this.state.transaction.attachment['version.AccountInfo'] &&
                            'Account info'
                        }
                        {
                            this.state.transaction.attachment['version.VoteCasting'] &&
                            'Vote casting'
                        }
                        {
                            this.state.transaction.attachment['version.PrunablePlainMessage'] &&
                            'MARKETPLACE LISTING'
                        }
                        {
                            this.state.transaction.attachment['version.CurrencyIssuance'] &&
                            'ISSUE CURRENCY'
                        }
                        {
                            this.state.transaction.attachment['version.CriticalUpdate'] &&
                            'CRITICAL UPDATE'
                        }
                        {
                            'version.TaggedDataUpload' in this.state.transaction.attachment &&
                            'TAGGED DATA UPLOAD'
                        }
                        {
                            'version.OrdinaryPayment' in this.state.transaction.attachment &&
                            'ORDINARY PAYMENT'
                        }
                        {
                            'version.PrivatePayment' in this.state.transaction.attachment &&
                            'PRIVATE PAYMENT'
                        }
                    </td>
                    <td className="align-right">
                        {this.state.transaction.amountATM / 100000000}
                    </td>
                    <td className="align-right">
                        {this.state.transaction.feeATM / 100000000}
                    </td>
                    <td className="blue-link-text">
                        <a>{this.state.transaction.senderRS + ' -> ' + this.props.transaction.recipientRS}</a>
                    </td>
                    <td className="align-right">
                    </td>
                    <td className="align-right blue-link-text">
                        <a>{this.state.transaction.height}</a>
                    </td>
                    <td className="align-right">
                        <a>{this.state.transaction.confirmations}</a>
                    </td>
                </tr>
            );
        } else {
            return (
                <tr key={uuid()}>ecrypted</tr>
            )
        }
    }
}

export default Transaction;