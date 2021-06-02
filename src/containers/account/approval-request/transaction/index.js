/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

import React from "react";
import { connect } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { setBodyModalParamsAction } from "../../../../modules/modals";
import { formatTimestamp } from "../../../../helpers/util/time";
import { getTransactionAction } from "../../../../actions/transactions";
import Button from "../../../components/button";

class Transaction extends React.Component {
  getTransactionInfo = async (transaction) => {
    return await this.props.getTransactionAction({
      transaction,
      random: Math.random(),
    });
  };

  render() {
    const {
      transaction,
      timestamp,
      formatTimestamp,
      amountATM,
      feeATM,
      senderRS,
      attachment,
      height,
      confirmations,
      setBodyModalParamsAction,
      decimals,
    } = this.props;

    return (
      <tr key={uuidv4()}>
        <td>
          <Button
            color="blue-link"
            onClick={async () =>
              setBodyModalParamsAction(
                "INFO_TRANSACTION",
                await this.getTransactionInfo(transaction)
              )
            }
            name={formatTimestamp(timestamp)}
          />
        </td>
        <td className="align-right">Ordinary Payment</td>
        <td className="align-right">{amountATM / decimals}</td>
        <td>{feeATM / decimals}</td>
        <td className="align-right">
          <Button
            color="blue-link"
            onClick={setBodyModalParamsAction.bind(
              this,
              "INFO_ACCOUNT",
              senderRS
            )}
            name={senderRS}
          />
        </td>
        <td>
          {attachment.phasingHolding} / {attachment.phasingQuorum}
        </td>
        <td>{height}</td>
        <td>{confirmations}</td>
        <td>
          <div className="btn-box inline">
            <Button
              color="blue-link"
              onClick={() => {
                setBodyModalParamsAction("APPROVE_TRANSACTION", {
                  transaction: this.props,
                });
              }}
              name={"Approve"}
            />
          </div>
        </td>
      </tr>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  formatTimestamp: (timestamp, date_only, isAbsoluteTime) =>
    dispatch(formatTimestamp(timestamp, date_only, isAbsoluteTime)),
  setBodyModalParamsAction: (type, data, valueForModal) =>
    dispatch(setBodyModalParamsAction(type, data, valueForModal)),
  getTransactionAction: (reqParams) =>
    dispatch(getTransactionAction(reqParams)),
});

const mapStateToProps = (state) => ({
  account: state.account.account,
  decimals: state.account.decimals,
});

export default connect(mapStateToProps, mapDispatchToProps)(Transaction);
