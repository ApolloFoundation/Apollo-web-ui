/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

import React from "react";
import { setBodyModalParamsAction } from "../../../../modules/modals";
import { connect } from "react-redux";
import { formatTimestamp } from "../../../../helpers/util/time";
import { formatTransactionType } from "../../../../actions/transactions";
import { getBlockAction } from "../../../../actions/blocks";
import Button from "../../../components/button";

const mapStateToProps = (state) => ({
  constants: state.account.constants,
  decimals: state.account.decimals,
});

const mapDispatchToProps = (dispatch) => ({
  setBodyModalParamsAction: (type, data, valueForModal) =>
    dispatch(setBodyModalParamsAction(type, data, valueForModal)),
  getBlockAction: (data) => dispatch(getBlockAction(data)),
  formatTimestamp: (timestamp, date_only, isAbsoluteTime) =>
    dispatch(formatTimestamp(timestamp, date_only, isAbsoluteTime)),
});

class Transaction extends React.Component {
  getBlock = async (blockHeight) => {
    this.props.setBodyModalParamsAction("INFO_BLOCK", blockHeight);
  };

  render() {
    const {
      feeATM,
      amountATM,
      subtype,
      type,
      transaction,
      constants,
      formatTimestamp,
      timestamp,
      sender,
      senderRS,
      recipient,
      recipientRS,
      height,
      isUnconfirmed,
      setBodyModalParamsAction,
      attachment,
      decimals,
    } = this.props;
    const transactionType = constants.transactionTypes && constants.transactionTypes[type];
    return (
      <tr>
        {transaction && constants && (
          <React.Fragment>
            <td className="blue-link-text">
              <Button
                color="blue-link"
                onClick={() =>
                  setBodyModalParamsAction("INFO_TRANSACTION", transaction)
                }
                name={formatTimestamp(timestamp)}
              />
            </td>
            <td>
              {!!transactionType &&
                (transactionType.subtypes[subtype].name === "AliasSell" &&
                amountATM === "0" &&
                attachment.priceATM === "0"
                  ? formatTransactionType("AliasTransfer")
                  : formatTransactionType(
                      transactionType.subtypes[subtype].name
                    ))}
            </td>
            <td className="align-right">{amountATM / decimals}</td>
            <td className="align-right">{feeATM / decimals}</td>
            <td className="blue-link-text">
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
            <td className="blue-link-text">
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
            <td className="align-right blue-link-text">
              {!isUnconfirmed && (
                <Button
                  color="blue-link"
                  onClick={() => setBodyModalParamsAction("INFO_BLOCK", height)}
                  name={height}
                />
              )}
              {isUnconfirmed && "-"}
            </td>
          </React.Fragment>
        )}
      </tr>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Transaction);
