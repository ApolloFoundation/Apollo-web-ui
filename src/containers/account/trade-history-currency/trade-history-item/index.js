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
import { Link } from 'react-router-dom';
import {formatTimestamp} from "../../../../helpers/util/time";

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
                <tr key={uuid()}>
                    <td>{this.props.formatTimestamp(this.state.transfer.timestamp)}</td>
                    <td className="blue-link-text">
                        <a onClick={() => this.props.setBodyModalParamsAction('INFO_TRANSACTION', this.state.transfer.transaction)}>{this.state.transfer.transaction}</a>

                    </td>
                    <td className="blue-link-text">
                        <a onClick={() => this.props.setBodyModalParamsAction('INFO_TRANSACTION', this.state.transfer.offer)}>{this.state.transfer.offer}</a>
                    </td>
                    <td>
                        <Link key={uuid()}
                              style={{display: 'block'}}
                              to={"/exchange-booth/" + (this.state ? this.state.code : "")}
                        >
                            {this.state.transfer.name}
                        </Link>
                    </td>
                    <td className="blue-link-text">
                        <a onClick={() => this.props.setBodyModalParamsAction('INFO_ACCOUNT', this.state.transfer.seller)}>
                            {this.state.transfer.sellerRS}
                        </a>
                    </td>
                    <td className="blue-link-text">
                        <a onClick={() => this.props.setBodyModalParamsAction('INFO_ACCOUNT', this.state.transfer.buyer)}>
                            {this.state.transfer.buyerRS}
                        </a>
                    </td>
                    <td className="align-right">
                        {(this.state.transfer.units / Math.pow(10, this.state.transfer.decimals)).toFixed(2)}
                        </td>
                    <td className="align-right">
                        {parseFloat(this.state.transfer.rateATM).toLocaleString('en')}
                        </td>
                    <td className="align-right">
                        {(this.state.transfer.units * this.state.transfer.rateATM / 100000000).toLocaleString('ru', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </td>
                </tr>
            );
        } else {
            return (
                <tr key={uuid()}/>
            );
        }
    }
}

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    formatTimestamp: (time) => dispatch(formatTimestamp(time)),

});

export default connect(null, mapDispatchToProps)(TradeHistoryItem);