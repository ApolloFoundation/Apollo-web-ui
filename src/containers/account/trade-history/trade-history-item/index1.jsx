/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

import React from "react";
import { v4 as uuidv4 } from "uuid";
import { setBodyModalParamsAction } from "../../../../modules/modals";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { formatTimestamp } from "../../../../helpers/util/time";
import { ONE_APL } from "../../../../constants";
import Button from "../../../components/button";

class TradeHistoryItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      transfer: this.props.transfer,
    };
  }

  render() {
    if (this.state.transfer) {
      return (
        <tr key={uuidv4()}>
          <td className="blue-link-text">
            <Link to={"/asset-exchange/" + this.state.transfer.asset}>
              {this.state.transfer.name}
            </Link>
          </td>
          <td>
            {this.props.formatTimestamp(this.state.transfer.timestamp)}
          </td>
          <td className="">{this.state.transfer.tradeType}</td>
          <td className="align-right">
            {this.state.transfer.quantityATU /
              Math.pow(10, this.state.transfer.decimals)}
          </td>
          <td className="align-right">
            {(this.state.transfer.priceATM / ONE_APL) *
              Math.pow(10, this.state.transfer.decimals)}
          </td>
          <td className="align-right">
            {(this.state.transfer.quantityATU / this.state.transfer.decimals) *
              ((this.state.transfer.priceATM / ONE_APL) *
                this.state.transfer.decimals)}
          </td>
          <td>
            <Button
              color="blue-link"
              onClick={this.props.setBodyModalParamsAction.bind(
                this,
                "INFO_ACCOUNT",
                this.state.transfer.buyer
              )}
              name={this.state.transfer.buyerRS}
            />
          </td>
          <td>
            <Button
              color="blue-link"
              onClick={this.props.setBodyModalParamsAction.bind(
                this,
                "INFO_ACCOUNT",
                this.state.transfer.seller
              )}
              name={this.state.transfer.sellerRS}
            />
          </td>
        </tr>
      );
    } else {
      return <tr key={uuidv4()}></tr>;
    }
  }
}

const mapDispatchToProps = (dispatch) => ({
  setBodyModalParamsAction: (type, data, valueForModal) =>
    dispatch(setBodyModalParamsAction(type, data, valueForModal)),
  formatTimestamp: (timestamp, date_only, isAbsoluteTime) =>
    dispatch(formatTimestamp(timestamp, date_only, isAbsoluteTime)),
});

export default connect(null, mapDispatchToProps)(TradeHistoryItem);
