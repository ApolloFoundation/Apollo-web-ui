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


                    <td>{this.state.transfer.timestamp}</td>
                    <td className="blue-link-text">
                        <a onClick={() => this.props.setTransaction(this.state.transfer.offer)}>{this.state.transfer.offer}</a>
                    </td>
                    <td className="blue-link-text">
                        <a onClick={() => this.props.setTransaction(this.state.transfer.transaction)}>{this.state.transfer.transaction}</a>

                    </td>
                    <td>
                        <Link key={uuid()}
                              style={{display: 'block'}}
                              to={"/exchange-booth/" + (this.state ? this.state.code : "")}
                        >
                            {this.state.transfer.name}
                        </Link>
                    </td>
                    <td>{this.state.transfer.seller}</td>
                    <td>
                        <a
                            onClick={() => this.state.setBodyModalParamsAction('INFO_ACCOUNT', this.state.transfer.buyer)}
                        >
                            {this.state.transfer.buyerRS}
                        </a>
                    </td>
                    <td className="align-right">{this.state.transfer.units / Math.pow(10, this.state.transfer.decimals)}</td>
                    <td className="align-right">{this.state.transfer.rateATM}</td>
                    <td className="align-right">Amount</td>
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