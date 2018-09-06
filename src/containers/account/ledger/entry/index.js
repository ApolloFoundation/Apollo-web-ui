import React from 'react';
import uuid from 'uuid';
import crypto from "../../../../helpers/crypto/crypto";
import converters from "../../../../helpers/converters";
import {setBodyModalParamsAction} from "../../../../modules/modals";
import {connect} from 'react-redux';
import {formatTimestamp} from "../../../../helpers/util/time";
import {getLedgerEntryAction} from "../../../../actions/ledger";
import {getTransactionAction} from "../../../../actions/transactions/";

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
        }
    }

    componentWillMount() {
        if (this.props.entry.encryptedLedgerEntry) {
            var options = {
                publicKey  :  converters.hexStringToByteArray(this.props.publicKey),
                privateKey :  converters.hexStringToByteArray(this.props.privateKey),
            };

            options.sharedKey = this.props.sharedKey;

            var decrypted =  crypto.decryptData(this.props.entry.encryptedLedgerEntry, options);
            decrypted = decrypted.message;

            decrypted = converters.hexStringToString(decrypted);
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
                        {this.state.entry.eventType}
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
                    <td className="align-right">-{this.state.entry.change / 100000000}</td>
                    <td>{(this.state.entry.balance / 100000000).toFixed(2)}</td>
                    <td>
                        <a></a>
                    </td>
                    <td className="align-right">
                        <a></a>
                    </td>
                    <td className="align-right">
                        <a></a>
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

});

export default connect(null, mapDispatchToProps)(Entry);