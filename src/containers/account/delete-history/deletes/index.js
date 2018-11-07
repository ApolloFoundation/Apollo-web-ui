/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import uuid from 'uuid';
import {setBodyModalParamsAction, setModalType} from "../../../../modules/modals";
import {connect} from 'react-redux';
import {formatTimestamp} from "../../../../helpers/util/time";
import {getTransactionAction} from "../../../../actions/transactions";

class DeleteItem extends React.Component {

    getTransactionInfo = async transaction => {
        return await this.props.getTransactionAction({
            transaction,
            random: Math.random()
        })
    };

    render() {
        return (
            <tr key={uuid()}>
                <td className="align-left blue-link-text">
                    <a onClick={async () => this.props.setBodyModalParamsAction('INFO_TRANSACTION', await this.getTransactionInfo(this.props.delete.assetDelete))}>
                        {this.props.delete.assetDelete}
                        </a>
                </td>
                <td className="align-left">{this.props.delete.name}</td>
                <td>{this.props.formatTimestamp(this.props.delete.timestamp)}</td>
                <td className="align-right">{this.props.delete.quantityATU / Math.pow(10, this.props.delete.decimals)}</td>
            </tr>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    setModalType: (type) => dispatch(setModalType(type)),
    getTransactionAction: (reqParams) => dispatch(getTransactionAction(reqParams)),
    formatTimestamp: (timestamp, date_only, isAbsoluteTime) => dispatch(formatTimestamp(timestamp, date_only, isAbsoluteTime))
});

export default connect(null, mapDispatchToProps)(DeleteItem);