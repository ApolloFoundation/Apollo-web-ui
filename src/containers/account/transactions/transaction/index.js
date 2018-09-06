import React from 'react';
import uuid from 'uuid';
import crypto from '../../../../helpers/crypto/crypto'
import converters from '../../../../helpers/converters';
import {setBodyModalParamsAction} from "../../../../modules/modals";
import {connect} from 'react-redux'
import {formatTimestamp} from "../../../../helpers/util/time";
import {formatTransactionType} from "../../../../actions/transactions";
import {getBlockAction} from "../../../../actions/blocks";

const mapStateToProps = state => ({
    constants: state.account.constants
});

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    getBlockAction: (data) => dispatch(getBlockAction(data)),
    formatTimestamp: (timestamp, date_only, isAbsoluteTime) => dispatch(formatTimestamp(timestamp, date_only, isAbsoluteTime))
});

@connect(mapStateToProps, mapDispatchToProps)
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

    async getBlock(type, blockHeight) {
        const requestParams = {
            height: blockHeight
        };

        const block = await this.props.getBlockAction(requestParams);

        if (block) {
            this.props.setBodyModalParamsAction('INFO_BLOCK', block)
        }
    }

    render () {
        console.log(this.props.transaction);
        if (this.props.block) {
            if (!this.state.transaction.encryptedTransaction) {
                return (
                    <tr key={uuid()}>
                        <td  key={uuid()} className="blue-link-text">
                            {this.props.index}
                        </td>
                        <td  key={uuid()} className="blue-link-text">
                            <a onClick={this.props.setTransactionInfo.bind(this, {transaction: this.state.transaction.transaction})}>{this.props.formatTimestamp(this.state.transaction.blockTimestamp)}</a>
                        </td>
                        <td  key={uuid()}>
                            {formatTransactionType(this.props.constants.transactionTypes[this.state.transaction.type].subtypes[this.state.transaction.subtype].name)}
                        </td>
                        <td  key={uuid()} className="align-right">
                            {this.state.transaction.amountATM / 100000000}
                        </td>
                        <td  key={uuid()} className="align-right">
                            {this.state.transaction.feeATM / 100000000}
                        </td>
                        <td  key={uuid()} className="blue-link-text">
                            <a>{this.state.transaction.senderRS}</a>
                        </td>
                        <td  key={uuid()} className="blue-link-text align-right">
                            {
                                this.props.transaction.recipientRS &&
                                <a>{this.props.transaction.recipientRS}</a>
                            }
                            {
                                !this.props.transaction.recipientRS &&
                                '-'
                            }
                        </td>
                    </tr>
                );
            } else {
                return (
                    <tr key={uuid()}>ecrypted</tr>
                )
            }
        } else {
            if (!this.state.transaction.encryptedTransaction) {
                return (
                    <tr key={uuid()}>
                        <td className="blue-link-text">
                            <a onClick={this.props.setTransactionInfo.bind(this, 'INFO_TRANSACTION', this.state.transaction.transaction)}>
                                {this.props.formatTimestamp(this.state.transaction.blockTimestamp)}
                            </a>
                        </td>
                        <td>
                            {formatTransactionType(this.props.constants.transactionTypes[this.state.transaction.type].subtypes[this.state.transaction.subtype].name)}
                        </td>
                        <td className="align-right">
                            {this.state.transaction.amountATM / 100000000}
                        </td>
                        <td className="align-right">
                            {this.state.transaction.feeATM / 100000000}
                        </td>
                        <td className="blue-link-text">
                            <a onClick={this.props.setBodyModalParamsAction.bind(this, 'INFO_ACCOUNT', this.state.transaction.sender)}>{this.state.transaction.senderRS}</a> -> <a onClick={this.props.setBodyModalParamsAction.bind(this, 'INFO_ACCOUNT', this.state.transaction.sender)}>{this.props.transaction.recipientRS}</a>
                        </td>
                        <td className="align-right">
                        </td>
                        <td className="align-right blue-link-text">
                            <a onClick={this.getBlock.bind(this, 'INFO_BLOCK', this.state.transaction.height)}>{this.state.transaction.height}</a>
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
}

export default Transaction;