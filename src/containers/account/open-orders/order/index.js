/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import uuid from 'uuid';
import {setBodyModalParamsAction} from "../../../../modules/modals";
import {connect} from 'react-redux';
import {getTransactionAction} from "../../../../actions/transactions";
import {getOrderInfoAction} from "../../../../actions/open-orders";
import {Link} from 'react-router-dom'

class OrderItem extends React.Component {

    state = {
        orderInfo: {}
    };

    getTransactionInfo = async transaction => {
        return await this.props.getTransactionAction({
            transaction,
            random: Math.random()
        })
    };

    componentDidMount() {
        this.getOrderInfo();
    }

    getOrderInfo = () => {
        this.props.getOrderInfo(this.props.order.asset).then(res => {
            console.warn("aitem", res, this.props.order);
            this.setState({
                orderInfo: res ? res : {}
            })
        });
    };

    render() {
        const {orderInfo} = this.state;
        return (
            <tr key={uuid()}>
                <td
                    className="align-left blue-link-text"
                >
                    <Link
                        to={`/asset-exchange/${orderInfo.asset}`}
                    >
                        {orderInfo.name}
                    </Link>
                </td>
                <td
                    className="align-left"
                >
                    {this.props.order.quantityATU / Math.pow(10, this.props.order.decimals)}
                </td>
                <td>{((this.props.order.quantityATU * this.props.order.priceATM) /  100000000) / (this.props.order.quantityATU / Math.pow(10, this.props.order.decimals))}</td>

                <td>{(this.props.order.quantityATU * this.props.order.priceATM) /  100000000}</td>
                <td
                    className={'align-right'}
                    onClick={() => this.props.setBodyModalParamsAction("CANCEL_ORDER", {...this.props.order, type: this.props.type})}
                >
                    Cancel
                </td>
            </tr>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    getTransactionAction: (reqParams) => dispatch(getTransactionAction(reqParams)),
    getOrderInfo: order => dispatch(getOrderInfoAction(order)),
});

export default connect(null, mapDispatchToProps)(OrderItem);