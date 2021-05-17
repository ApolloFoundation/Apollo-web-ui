/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from "react";
import { connect } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import { setBodyModalParamsAction } from "../../../../modules/modals";
import { getTransactionAction } from "../../../../actions/transactions";
import { formatTimestamp } from "../../../../helpers/util/time";
const mapStateToProps = (state) => ({
  actualBlock: state.account.actualBlock,
  decimals: state.account.decimals,
  balanceAPL: state.account.unconfirmedBalanceATM,
});

const mapDispatchToProps = (dispatch) => ({
  setBodyModalParamsAction: (type, data, valueForModal) =>
    dispatch(setBodyModalParamsAction(type, data, valueForModal)),
  formatTimestamp: (time) => dispatch(formatTimestamp(time)),
  getTransaction: (transaction) => dispatch(getTransactionAction(transaction)),
});

const PoolItem = (props) => {
  const {
    address,
    name,
    params,
    timestamp,
    fuelLimit,
    fuelPrice,
    transaction,
    amount,
    signature,
    status,
  } = props;

  const currentDate = props.formatTimestamp(new Date(timestamp));
  const currentParams = params.length > 0 ? params.join() : "-";

  return (
    <tr key={uuidv4()}>
      <td key={uuidv4()}>{address}</td>
      <td key={uuidv4()}>{name}</td>
      <td key={uuidv4()}>{currentParams}</td>
      <td key={uuidv4()}>
        {fuelLimit} / {fuelPrice}
      </td>
      <td key={uuidv4()}>{transaction}</td>
      <td key={uuidv4()}>{amount}</td>
      <td key={uuidv4()}>{signature.substring(0, 12)}</td>
      <td key={uuidv4()}>{currentDate}</td>
      <td key={uuidv4()}>{status}</td>
      <td key={uuidv4()} className="align-right">
        <div className="btn-box inline">
          <button
            type={"button"}
            onClick={() => props.setBodyModalParamsAction("CAST_VOTE", {})}
            className={`btn btn-green btn-sm`}
          >
            Send message
          </button>
        </div>
      </td>
    </tr>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(PoolItem);
