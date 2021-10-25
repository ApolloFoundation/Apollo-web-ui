/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

import React from "react";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { setBodyModalParamsAction } from "../../../../modules/modals";
import { formatTimestamp } from "../../../../helpers/util/time";
import Button from "../../../components/button";

class TradeHistoryItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      transfer: this.props.transfer,
    };
  }

  render() {
    if (this.props.transfer) {
      return (
        <tr>
          <td className="blue-link-text">
            <Link to={"/asset-exchange/" + this.props.transfer.asset}>
              {this.props.transfer.name}
            </Link>
          </td>
          <td>
            {this.props.formatTimestamp(this.props.transfer.timestamp)}
            <span className="info pointer" />
          </td>
          <td className="">{this.props.transfer.tradeType}</td>
          <td className="align-right">
            {this.props.transfer.quantityATU /
              Math.pow(10, this.props.transfer.decimals)}
          </td>
          <td className="align-right">
            {(this.props.transfer.priceATM / this.props.decimals) *
              Math.pow(10, this.props.transfer.decimals)}
          </td>
          <td className="align-right">
            {(this.props.transfer.quantityATU / this.props.transfer.decimals) *
              ((this.props.transfer.priceATM / this.props.decimals) *
                this.props.transfer.decimals)}
          </td>
          <td>
            <Button
              color="blue-link"
              onClick={this.props.setBodyModalParamsAction.bind(
                this,
                "INFO_ACCOUNT",
                this.props.transfer.buyer
              )}
              name={this.props.transfer.buyerRS}
            />
          </td>
          <td>
            <Button
              color="blue-link"
              onClick={this.props.setBodyModalParamsAction.bind(
                this,
                "INFO_ACCOUNT",
                this.props.transfer.seller
              )}
              name={this.props.transfer.sellerRS}
            />
          </td>
        </tr>
      );
    }
    return <tr key={uuidv4()}></tr>;
  }
}

const mapStateToProps = (state) => ({
  decimals: state.account.decimals,
});

const mapDispatchToProps = (dispatch) => ({
  setBodyModalParamsAction: (type, data, valueForModal) =>
    dispatch(setBodyModalParamsAction(type, data, valueForModal)),
  formatTimestamp: (timestamp, date_only, isAbsoluteTime) =>
    dispatch(formatTimestamp(timestamp, date_only, isAbsoluteTime)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TradeHistoryItem);
