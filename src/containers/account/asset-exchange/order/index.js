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
        this.props.getOrderInfo(this.props.asset).then(res => {
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
                    {orderInfo.name}
                </td>

                <td
                    className="align-left"
                >
                    {this.props.quantityATU / Math.pow(10, this.props.decimals)}
                </td>

                <td>{((this.props.quantityATU * this.props.priceATM) /  ONE_APL) / (this.props.quantityATU / Math.pow(10, this.props.decimals))}</td>

                <td className="align-right">{(this.props.quantityATU * this.props.priceATM) /  ONE_APL}</td>

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
