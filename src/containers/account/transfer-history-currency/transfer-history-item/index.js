/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import uuid from 'uuid';
import {Link} from 'react-router-dom';
import {setBodyModalParamsAction} from "../../../../modules/modals";
import {connect} from 'react-redux';
import {formatTimestamp} from "../../../../helpers/util/time";

class TransferHistoryItem extends React.Component {

    render () {
        const {setBodyModalParamsAction, transfer, code, timestamp, formatTimestamp, units, decimals, recipient, recipientRS, sender, senderRS} = this.props;

        return (
            <tr key={uuid()}>
                <td className="blue-link-text">
                    <a 
                        onClick={() => setBodyModalParamsAction('INFO_TRANSACTION', transfer)}
                    >
                        {transfer}
                    </a>
                </td>
                <td className="blue-link-text">
                    <Link to={"/exchange-booth/" + code}>{code}</Link>
                </td>
                <td className="">{formatTimestamp(timestamp)}</td>
                <td className="align-right" >{units / Math.pow(10, decimals)}</td>
                <td className="blue-link-text">
                    <a onClick={() => setBodyModalParamsAction('INFO_ACCOUNT', recipient)}>{recipientRS}</a>
                </td>
                <td className="blue-link-text">
                    <a onClick={() => setBodyModalParamsAction('INFO_ACCOUNT', sender)}>{senderRS}</a>
                </td>
            </tr>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    formatTimestamp: (timestamp, date_only, isAbsoluteTime) => dispatch(formatTimestamp(timestamp, date_only, isAbsoluteTime)),
});

export default connect(null, mapDispatchToProps)(TransferHistoryItem);