/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import i18n from 'i18next';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {withTranslation} from 'react-i18next';
import {setBodyModalParamsAction} from '../../../../modules/modals';
import {formatTimestamp} from '../../../../helpers/util/time';
import {getTransactionAction} from '../../../../actions/transactions/';
import {getBlockAction} from '../../../../actions/blocks';
import {ONE_APL} from '../../../../constants';

class Entry extends React.Component {
    showInfo = () => {
        if (this.props.eventType === "BLOCK_GENERATED") {
            this.props.setBodyModalParamsAction('INFO_BLOCK', this.props.height);
        } else {
            this.props.setBodyModalParamsAction('INFO_TRANSACTION', this.props.event, this.props.eventType === 'PRIVATE_PAYMENT');
        }
    };

    render () {
        const {setBodyModalParamsAction, formatTimestamp} = this.props;

        return (
            <React.Fragment>
                {
                    this.props.ledgerId &&
                    <tr>
                        <td className="blue-link-text">
                            <a
                                onClick={
                                    () => setBodyModalParamsAction('INFO_LEDGER_TRANSACTION', this.props.ledgerId, this.props.eventType === 'PRIVATE_PAYMENT')
                                }
                            >
                                {formatTimestamp(this.props.timestamp)}
                            </a>
                        </td>
                        <td>
                            {this.props.ledgerId && this.props.eventType && (
                                i18n.t(this.props.eventType.toLowerCase())
                            )}
                            &nbsp;&nbsp;
                            <a
                                onClick={this.showInfo}
                            >
                            <span
                                className="zmdi zmdi-info"
                            />
                            </a>
                        </td>
                        <td className="align-right">
                            {this.props.holdingType === "UNCONFIRMED_APL_BALANCE" &&
                            (this.props.change / ONE_APL).toFixed(1)}
                        </td>
                        <td className="align-right">
                            {this.props.holdingType === "UNCONFIRMED_APL_BALANCE" && this.props.balance > 0 &&
                            (this.props.balance / ONE_APL).toLocaleString('en')}
                        </td>
                        <td className="align-right">
                            {this.props.holdingInfo && this.props.holdingInfo.name}
                        </td>
                        <td className="align-right">
                            {this.props.holdingType === "UNCONFIRMED_CURRENCY_BALANCE" &&
                            this.props.holdingInfo && this.props.holdingInfo.name &&
                            (this.props.change/1).toFixed(2)}
                            {this.props.holdingType === "UNCONFIRMED_ASSET_BALANCE" &&
                            (this.props.change/ONE_APL).toFixed(2)}
                        </td>
                        <td className="align-right">
                            {this.props.holdingType === "UNCONFIRMED_CURRENCY_BALANCE" &&
                            this.props.holdingInfo && this.props.holdingInfo.name &&
                            (this.props.balance/1).toLocaleString('en')}
                            {this.props.holdingType === "UNCONFIRMED_ASSET_BALANCE" &&
                            (this.props.balance/ONE_APL).toLocaleString('en')}
                        </td>
                    </tr>
                }
            </React.Fragment>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    formatTimestamp: (timestamp, date_only, isAbsoluteTime) => dispatch(formatTimestamp(timestamp, date_only, isAbsoluteTime)),
    getTransactionAction: (reqParams) => dispatch(getTransactionAction(reqParams)),
    getBlockAction: (requestParams) => dispatch(getBlockAction(requestParams)),
});

export default compose(
    withTranslation(),
    connect(null, mapDispatchToProps),
)(Entry);
