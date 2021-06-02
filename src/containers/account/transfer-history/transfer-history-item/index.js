/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

import React from "react";
import { setBodyModalParamsAction } from "../../../../modules/modals";
import { connect } from "react-redux";
import { formatTimestamp } from "../../../../helpers/util/time";
import Button from "../../../components/button";

class TransferHistoryItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      transfer: this.props.transfer,
    };
  }

  render() {
    const {
      setBodyModalParamsAction,
      assetTransfer,
      timestamp,
      name,
      decimals,
      quantityATU,
      recipient,
      sender,
      senderRS,
      recipientRS,
    } = this.props;

    return (
      <tr key={assetTransfer}>
        <td>
          <Button
            color="blue-link"
            onClick={setBodyModalParamsAction.bind(
              this,
              "INFO_TRANSACTION",
              assetTransfer
            )}
            name={assetTransfer}
          />
        </td>
        <td>{name}</td>
        <td className="">{this.props.formatTimestamp(timestamp)}</td>
        <td className="align-right">
          {(quantityATU / Math.pow(10, decimals)).toLocaleString("en", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })}
        </td>
        <td>
          <Button
            color="blue-link"
            onClick={setBodyModalParamsAction.bind(
              this,
              "INFO_ACCOUNT",
              recipient
            )}
            name={recipientRS}
          />
        </td>
        <td>
          <Button
            color="blue-link"
            onClick={setBodyModalParamsAction.bind(
              this,
              "INFO_ACCOUNT",
              sender
            )}
            name={senderRS}
          />
        </td>
      </tr>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  setBodyModalParamsAction: (type, data, valueForModal) =>
    dispatch(setBodyModalParamsAction(type, data, valueForModal)),
  formatTimestamp: (timestamp, date_only, isAbsoluteTime) =>
    dispatch(formatTimestamp(timestamp, date_only, isAbsoluteTime)),
});

export default connect(null, mapDispatchToProps)(TransferHistoryItem);
