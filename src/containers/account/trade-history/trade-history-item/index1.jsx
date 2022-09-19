/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {setBodyModalParamsAction} from "../../../../modules/modals";
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';
import {formatTimestamp} from "../../../../helpers/util/time";
import {ONE_APL} from '../../../../constants';

class TradeHistoryItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            transfer: this.props.transfer
        }
    }

    render () {
        if (this.state.transfer) {
            return (
                <tr>
                    <td className="blue-link-text">
                        <Link to={'/asset-exchange/' + this.state.transfer.asset}>{this.state.transfer.name}</Link>
                    </td>
                    <td>
                        {this.props.formatTimestamp(this.state.transfer.timestamp)}
                        <a><span className="info"/></a>
                    </td>
                    <td className="">{this.state.transfer.tradeType}</td>
                    <td className="align-right">{this.state.transfer.quantityATU/ Math.pow(10, this.state.transfer.decimals)}</td>
                    <td className="align-right">{(this.state.transfer.priceATM / ONE_APL) * Math.pow(10, this.state.transfer.decimals)}</td>
                    <td className="align-right" >{((this.state.transfer.quantityATU )/ this.state.transfer.decimals) * ((this.state.transfer.priceATM / ONE_APL) * this.state.transfer.decimals)}</td>
                    <td className="blue-link-text">
                        <a onClick={this.props.setBodyModalParamsAction.bind(this, 'INFO_ACCOUNT', this.state.transfer.buyer)}>{this.state.transfer.buyerRS}</a>
                    </td>
                    <td className="blue-link-text">
                        <a onClick={this.props.setBodyModalParamsAction.bind(this, 'INFO_ACCOUNT', this.state.transfer.seller)}>{this.state.transfer.sellerRS}</a>
                    </td>
                </tr>
            );
        } else {
            return (
                <tr></tr>
            );
        }
    }
}

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    formatTimestamp: (timestamp, date_only, isAbsoluteTime) => dispatch(formatTimestamp(timestamp, date_only, isAbsoluteTime)),
});

export default connect(null, mapDispatchToProps)(TradeHistoryItem);
