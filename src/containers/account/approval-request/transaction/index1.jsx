/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { setBodyModalParamsAction } from "../../../../modules/modals";
import { formatTimestamp } from "../../../../helpers/util/time";
import { getTransactionAction } from "../../../../actions/transactions";
import Button from "../../../components/button";

export default function Transaction(props) {
  const dispatch = useDispatch();

  const { decimals } = useSelector((state) => state.account);

  const {
    transaction,
    timestamp,
    amountATM,
    confirmations,
    feeATM,
    senderRS,
    attachment,
    height,
  } = props;

  const getTransactionInfo = useCallback(
    async (currTransaction) => {
      const transactionActions = await dispatch(
        getTransactionAction({
          currTransaction,
          random: Math.random(),
        })
      );
      return transactionActions;
    },
    [dispatch]
  );

  return (
    <tr key={uuidv4()}>
      <td>
        <Button
          color="blue-link"
          onClick={async () =>
            dispatch(
              setBodyModalParamsAction(
                "INFO_TRANSACTION",
                await getTransactionInfo(transaction)
              )
            )
          }
          name={dispatch(formatTimestamp(timestamp))}
        />
      </td>
      <td className="align-right">Ordinary Payment</td>
      <td className="align-right">{amountATM / decimals}</td>
      <td>{feeATM / decimals}</td>
      <td className="align-right">
        <Button
          color="blue-link"
          onClick={() =>
            dispatch(setBodyModalParamsAction("INFO_ACCOUNT", senderRS))
          }
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
            onClick={() => {
              setBodyModalParamsAction("APPROVE_TRANSACTION", {
                transaction: props,
              });
            }}
            name={"Approve"}
          />
        </div>
      </td>
    </tr>
  );
}
