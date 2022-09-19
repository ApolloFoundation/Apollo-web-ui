/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import crypto from "../../../../helpers/crypto/crypto";
import converters from "../../../../helpers/converters";
import {setBodyModalParamsAction} from "../../../../modules/modals";
import {connect} from 'react-redux';

class Asset extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            entry: this.props.entry
        }
    }

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
                <tr>
                    <td className="blue-link-text">
                        <a onClick={this.props.setBodyModalParamsAction.bind(this, 'INFO_LEDGER_TRANSACTION', this.state.entry.ledgerId)}>{this.state.entry.timestamp}</a>
                    </td>
                    <td>
                        {this.state.entry.eventType}
                        <a><span className="info"></span></a>
                    </td>
                    <td className="align-right">-{this.state.entry.change / this.props.decimals}</td>
                    <td>{(this.state.entry.balance / this.props.decimals).toFixed(2)}</td>
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

const mapStateToProps = state => ({
  decimals: state.account.decimals,
});

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Asset);
