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
import {ONE_APL} from '../../../../constants';

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
                <td>{((this.props.order.quantityATU * this.props.order.priceATM) /  ONE_APL) / (this.props.order.quantityATU / Math.pow(10, this.props.order.decimals))}</td>

                <td>{(this.props.order.quantityATU * this.props.order.priceATM) /  ONE_APL}</td>
                <td className="align-right">
                    <div className="btn-box inline">
                        <button
                            type={'button'}
                            className={'btn btn-default'}
                            onClick={() => this.props.setBodyModalParamsAction("CANCEL_ORDER", {...this.props.order, type: this.props.type})}
                        >
                            Cancel
                        </button>
                    </div>

                </td>
            </tr>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    getTransactionAction: (reqParams) => dispatch(getTransactionAction(reqParams)),
    getOrderInfo: order => dispatch(getOrderInfoAction(order)),
});

export default connect(null, mapDispatchToProps)(OrderItem);
