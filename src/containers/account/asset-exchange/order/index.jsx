/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from 'react';
import { connect } from 'react-redux';
import { setBodyModalParamsAction } from '../../../../modules/modals';
import { getTransactionAction } from '../../../../actions/transactions';
import { getOrderInfoAction } from '../../../../actions/open-orders';

class OrderItem extends React.Component {
    state = { orderInfo: {} };

    componentDidMount() {
      this.getOrderInfo();
    }

    getTransactionInfo = async transaction => await this.props.getTransactionAction({
      transaction,
      random: Math.random(),
    });

    getOrderInfo = () => {
      this.props.getOrderInfo(this.props.asset).then(res => {
        this.setState({ orderInfo: res || {} });
      });
    };

    render() {
      const { orderInfo } = this.state;
      return (
        <tr>
          <td className="align-left blue-link-text">
            {orderInfo.name}
          </td>
          <td className="align-left">
            {this.props.quantityATU / (10 ** this.props.decimals)}
          </td>
          <td>{((this.props.quantityATU * this.props.priceATM) / this.props.currentCoinDecimals) / (this.props.quantityATU / (10 ** this.props.decimals))}</td>
          <td>{(this.props.quantityATU * this.props.priceATM) / this.props.currentCoinDecimals}</td>
        </tr>
      );
    }
}

const mapStateToProps = state => ({
  currentCoinDecimals: state.account.decimals,
});

const mapDispatchToProps = dispatch => ({
  setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
  getTransactionAction: reqParams => dispatch(getTransactionAction(reqParams)),
  getOrderInfo: order => dispatch(getOrderInfoAction(order)),
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderItem);
