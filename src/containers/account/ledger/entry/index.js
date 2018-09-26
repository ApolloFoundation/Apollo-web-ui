import React from 'react';
import uuid from 'uuid';
import i18n from 'i18next';
import crypto from "../../../../helpers/crypto/crypto";
import converters from "../../../../helpers/converters";
import {setBodyModalParamsAction} from "../../../../modules/modals";
import {connect} from 'react-redux';
import {formatTimestamp} from "../../../../helpers/util/time";
import {getLedgerEntryAction} from "../../../../actions/ledger";
import {getTransactionAction} from "../../../../actions/transactions/";
import {getBlockAction} from "../../../../actions/blocks";

class Entry extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            entry: this.props.entry
        }
    }

    getTransaction = async (transaction) => {

        const requestParams = {
            transaction: transaction
        };

        const transactionEntry = await this.props.getTransactionAction(requestParams);

        if (transactionEntry) {
            this.props.setBodyModalParamsAction('INFO_TRANSACTION', transactionEntry)
        } else {
            const block = await this.props.getBlockAction(requestParams);

            if (block) {
                this.props.setBodyModalParamsAction('INFO_BLOCK', block)
            }
        }
    };

    componentWillMount() {
        if (this.props.entry.encryptedLedgerEntry) {
            var options = {
                publicKey  :  converters.hexStringToByteArray(this.props.publicKey),
                privateKey :  converters.hexStringToByteArray(this.props.privateKey),
            };

            options.sharedKey = this.props.sharedKey;

            var decrypted =  crypto.decryptDataStreamAPL(this.props.entry.encryptedLedgerEntry, options);
            decrypted = decrypted.message;

            decrypted = converters.hexStringToStringAPL(decrypted);
            decrypted = decrypted.slice(0, decrypted.lastIndexOf('}') + 1);
            decrypted = JSON.parse(decrypted);

            this.setState({
                entry: decrypted
            })
        }
    }

    render () {
        if (!this.state.entry.encryptedLedgerEntry) {
            return (
                <tr key={uuid()}>
                    <td className="blue-link-text">
                        <a onClick={this.props.setBodyModalParamsAction.bind(this, 'INFO_LEDGER_TRANSACTION', this.state.entry.ledgerId)}>
                            {this.props.formatTimestamp(this.state.entry.timestamp)}
                        </a>
                    </td>
                    <td>
                        {i18n.t(this.state.entry.eventType.toLowerCase())}
                        &nbsp;&nbsp;
                        <a
                            onClick={() => this.getTransaction(this.state.entry.event)}
                        >
                            <span
                                style={{color: '#00C8FF'}}
                                className="zmdi zmdi-info"
                            />
                        </a>
                    </td>
                    <td className="align-right">
                        {this.state.entry.holdingType === "UNCONFIRMED_APL_BALANCE" &&
                        (this.state.entry.change / 100000000).toFixed(1)}
                    </td>
                    <td className="align-right">
                        {this.state.entry.holdingType === "UNCONFIRMED_APL_BALANCE" && this.state.entry.balance > 0 &&
                        (this.state.entry.balance / 100000000).toLocaleString('en')}
                    </td>
                    <td className="align-right">
                        {this.state.entry.holdingInfo && this.state.entry.holdingInfo.name}
                    </td>
                    <td className="align-right">
                        {this.state.entry.holdingType === "UNCONFIRMED_CURRENCY_BALANCE" &&
                        this.state.entry.holdingInfo && this.state.entry.holdingInfo.name &&
                        (this.state.entry.change/1).toFixed(2)}
                        {this.state.entry.holdingType === "UNCONFIRMED_ASSET_BALANCE" &&
                        (this.state.entry.change/100000000).toFixed(2)}
                    </td>
                    <td className="align-right">
                        {this.state.entry.holdingType === "UNCONFIRMED_CURRENCY_BALANCE" &&
                        this.state.entry.holdingInfo && this.state.entry.holdingInfo.name &&
                        (this.state.entry.balance/1).toLocaleString('en')}
                        {this.state.entry.holdingType === "UNCONFIRMED_ASSET_BALANCE" &&
                        (this.state.entry.balance/100000000).toLocaleString('en')}
                    </td>
                </tr>
            );
        } else {
            return (
                <tr>encrypted</tr>
            )
        }
    }
}

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    formatTimestamp: (timestamp, date_only, isAbsoluteTime) => dispatch(formatTimestamp(timestamp, date_only, isAbsoluteTime)),
    getTransactionAction: (reqParams) => dispatch(getTransactionAction(reqParams)),
    getBlockAction: (requestParams) => dispatch(getBlockAction(requestParams)),
});

export default connect(null, mapDispatchToProps)(Entry);