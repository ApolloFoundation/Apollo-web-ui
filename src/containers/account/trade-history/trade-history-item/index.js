import React from 'react';
import uuid from 'uuid';
import crypto from "../../../../helpers/crypto/crypto";
import converters from "../../../../helpers/converters";
import {setBodyModalParamsAction} from "../../../../modules/modals";
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';

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
                    <td className="blue-link-text">
                        <Link to={'/asset-exchange/' + this.state.transfer.asset}>{this.state.transfer.name}</Link>
                    </td>
                    <td>
                        {this.state.transfer.timestamp}
                        <a><span className="info"/></a>
                    </td>
                    <td className="">{this.state.transfer.tradeType}</td>
                    <td className="align-right">{this.state.transfer.quantityATU}</td>
                    <td className="align-right">{this.state.transfer.quantityATU}</td>
                    <td className="align-right" >{this.state.transfer.quantityATU}</td>
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
                <tr key={uuid()}></tr>
            );
        }
    }
}

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data))
});

export default connect(null, mapDispatchToProps)(TradeHistoryItem);