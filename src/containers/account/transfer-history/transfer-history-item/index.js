/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import { v4 as uuidv4 } from 'uuid';
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
        const {setBodyModalParamsAction, assetTransfer, timestamp, name, decimals, quantityATU, recipient, sender, senderRS, recipientRS} = this.props;

        return (
            <tr key={assetTransfer}>
                <td className="blue-link-text">
                    <a onClick={setBodyModalParamsAction.bind(this, 'INFO_TRANSACTION', assetTransfer)}>{assetTransfer}</a>
                </td>
                <td>
                    {name}
                    <a><span className="info"/></a>
                </td>
                <td className="">{this.props.formatTimestamp(timestamp)}</td>
                <td className="align-right" >{(quantityATU / Math.pow(10, decimals)).toLocaleString('en', {
                    minimumFractionDigits: decimals,
                    maximumFractionDigits: decimals
                })}</td>
                <td className="blue-link-text">
                    <a onClick={setBodyModalParamsAction.bind(this, 'INFO_ACCOUNT', recipient)}>{recipientRS}</a>
                </td>
                <td className="blue-link-text">
                    <a onClick={setBodyModalParamsAction.bind(this, 'INFO_ACCOUNT', sender)}>{senderRS}</a>
                </td>
            </tr>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    formatTimestamp: (timestamp, date_only, isAbsoluteTime) => dispatch(formatTimestamp(timestamp, date_only, isAbsoluteTime)),
});

export default connect(null, mapDispatchToProps)(TransferHistoryItem);
