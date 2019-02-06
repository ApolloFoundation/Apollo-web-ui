/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


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
            entry: this.props
        }
    }

	showInfo = () => {
		if (this.state.entry.eventType === "BLOCK_GENERATED") {
			this.props.setBodyModalParamsAction('INFO_BLOCK', this.state.entry.height);
		} else {
			this.props.setBodyModalParamsAction('INFO_TRANSACTION', this.state.entry.event, this.state.entry.eventType === 'PRIVATE_PAYMENT');
		}
	};

    render () {
        const {setBodyModalParamsAction, formatTimestamp} = this.props;

        return (
            <React.Fragment>
                {
                    this.state.entry &&
                    <tr key={uuid()}>
                        <td className="blue-link-text">
                            <a
                                onClick={
                                    () => setBodyModalParamsAction('INFO_LEDGER_TRANSACTION', this.state.entry.ledgerId, this.state.entry.eventType === 'PRIVATE_PAYMENT')
                                }
                            >
                                {formatTimestamp(this.state.entry.timestamp)}
                            </a>
                        </td>
                        <td>
                            {this.state.entry && this.state.entry.eventType && this.state.entry.eventType.toLowerCase()}
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

export default connect(null, mapDispatchToProps)(Entry);