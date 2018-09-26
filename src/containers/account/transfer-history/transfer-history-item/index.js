/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import uuid from 'uuid';
import crypto from "../../../../helpers/crypto/crypto";
import converters from "../../../../helpers/converters";
import {setBodyModalParamsAction} from "../../../../modules/modals";
import {connect} from 'react-redux';
import {formatTimestamp} from "../../../../helpers/util/time";

class TransferHistoryItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            transfer: this.props.transfer
        }
    }

    render () {
        if (this.state.transfer) {
            return (
                <tr key={uuid()}>
                    <td className="blue-link-text">
                        <a onClick={this.props.setTransaction.bind(this, this.state.transfer.assetTransfer)}>{this.state.transfer.assetTransfer}</a>
                    </td>
                    <td>
                        {this.state.transfer.name}
                        <a><span className="info"></span></a>
                    </td>
                    <td className="">{this.props.formatTimestamp(this.state.transfer.timestamp)}</td>
                    <td className="align-right" >{(this.state.transfer.quantityATU / Math.pow(10, this.state.transfer.decimals)).toLocaleString('en', {
                        minimumFractionDigits: this.state.transfer.decimals,
                        maximumFractionDigits: this.state.transfer.decimals
                    })}</td>
                    <td className="blue-link-text">
                        <a onClick={this.props.setBodyModalParamsAction.bind(this, 'INFO_ACCOUNT', this.state.transfer.recipient)}>{this.state.transfer.recipientRS}</a>
                    </td>
                    <td className="blue-link-text">
                        <a onClick={this.props.setBodyModalParamsAction.bind(this, 'INFO_ACCOUNT', this.state.transfer.sender)}>{this.state.transfer.senderRS}</a>
                    </td>
                    <td className="">
                        <a></a>
                    </td>
                </tr>
            );
        } else {
            return (
                <tr key={uuid()}></tr>
            );
        }
    }
}

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    formatTimestamp: (timestamp, date_only, isAbsoluteTime) => dispatch(formatTimestamp(timestamp, date_only, isAbsoluteTime)),
});

export default connect(null, mapDispatchToProps)(TransferHistoryItem);