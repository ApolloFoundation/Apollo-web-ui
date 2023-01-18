/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom'
import {setBodyModalParamsAction} from "../../../../modules/modals";
import {getTransactionAction} from "../../../../actions/transactions";
import {getOrderInfoAction} from "../../../../actions/open-orders";
import { getDecimalsSelector } from '../../../../selectors';

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
            <tr>
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
                    {this.props.quantityATU / Math.pow(10, this.props.decimals)}
                </td>
                <td>{((this.props.quantityATU * this.props.priceATM) /  this.props.currentCoinDecimals) / (this.props.quantityATU / Math.pow(10, this.props.decimals))}</td>

                <td>{(this.props.quantityATU * this.props.priceATM) /  this.props.currentCoinDecimals}</td>
                <td className="align-right">
                    <div className="btn-box inline">
                        <button
                            type={'button'}
                            className={'btn btn-default'}
                            onClick={() => this.props.setBodyModalParamsAction("CANCEL_ORDER", {...this.props, type: this.props.type})}
                        >
                            Cancel
                        </button>
                    </div>

                </td>
            </tr>
        );
    }
}

const mapStateToProps = state => ({
  currentCoinDecimals: getDecimalsSelector(state),
});

const mapDispatchToProps = {
    setBodyModalParamsAction,
    getTransactionAction,
    getOrderInfo: getOrderInfoAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderItem);
