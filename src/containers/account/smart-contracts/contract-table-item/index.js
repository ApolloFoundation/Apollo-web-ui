/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from "react";
import { v4 as uuidv4 } from "uuid";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { setBodyModalParamsAction } from "../../../../modules/modals";
import { formatTimestamp } from "../../../../helpers/util/time";
import Button from "../../../components/button";
import { getTransactionAction } from "../../../../actions/transactions";

export const ContractTableItem = ({
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
}) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const currentDate = dispatch(formatTimestamp(new Date(timestamp)));

  const handleContractInfo = () => {
    const regAPL = /^APL20/;
    regAPL.test(name)
      ? history.push(`/smart-contracts/explorer/${address}`)
      : dispatch(setBodyModalParamsAction("SMC_INFO", { address }));
  };

  const handleSendMessage = () => {
    dispatch(setBodyModalParamsAction("SMC_CREATE", { address }));
  };

  const handleTransactionInfo = async () => {
    const transactionInfo = await dispatch(
      getTransactionAction({ transaction: transaction })
    );
    if (transactionInfo) {
      dispatch(setBodyModalParamsAction("INFO_TRANSACTION", transactionInfo));
    }
  };
  return (
    <tr key={uuidv4()}>
      <td>
        <Button color="blue-link" onClick={handleContractInfo} name={address} />
      </td>
      <td>{name}</td>
      <td>{params}</td>
      <td>
        {fuelLimit} / {fuelPrice}
      </td>
      <td>
        <Button
          color="blue-link"
          onClick={handleTransactionInfo}
          name={transaction}
        />
      </td>
      <td>{amount}</td>
      <td>{signature.substr(-12)}</td>
      <td>{currentDate}</td>
      <td>{status}</td>
      <td className="align-right">
        <div className="btn-box inline">
          <button
            type={"button"}
            onClick={handleSendMessage}
            className={`btn btn-green btn-sm`}
          >
            Send message
          </button>
        </div>
      </td>
    </tr>
  );
};
