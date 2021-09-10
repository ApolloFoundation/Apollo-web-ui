/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from "react";
import { v4 as uuidv4 } from "uuid";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { formatTimestamp } from "../../../../helpers/util/time";
import { setBodyModalParamsAction } from "../../../../modules/modals";
import { getTransactionAction } from "../../../../actions/transactions";
import { getSmcSpecification } from "../../../../actions/contracts";
import Button from "../../../components/button";

export const ContractTableItem = ({
  address,
  name,
  timestamp,
  transaction,
  signature,
  baseContract,
  status,
  id,
}) => {
  const history = useHistory();
  const dispatch = useDispatch();

  const currentDate = dispatch(formatTimestamp(new Date(timestamp)));

  const isStatusAPL20 = !!/^APL20BUY/.test(baseContract) || !!/^APL20LOCK/.test(baseContract);

  const handleContractInfo = () => {
    isStatusAPL20
      ? history.push(`/smart-contracts/explorer/${address}`)
      : dispatch(setBodyModalParamsAction("SMC_INFO", { address }));
  };

  const handleSendMessage = () => {
    dispatch(setBodyModalParamsAction("SMC_CREATE", { address }));
  };

  const handleTransactionInfo = async () => {
    const transactionInfo = await dispatch(
      getTransactionAction({
        transaction: transaction,
      })
    );
    if (transactionInfo) {
      dispatch(setBodyModalParamsAction("INFO_TRANSACTION", transactionInfo));
    }
  };

  const handleByMethod = async () => {
    const specifInfo = await dispatch(getSmcSpecification(address));
    if (specifInfo) {
      const smcInfo = specifInfo.members.reduce(
        (ac, { ["name"]: x, ...rest }) => ((ac[x] = rest.value), ac),
        {}
      );
      dispatch(setBodyModalParamsAction("SMC_BUY", { address, smcInfo }));
    }
  };

  return (
    <tr key={uuidv4()}>
      <td>
        <Button color="blue-link" onClick={handleContractInfo} name={address} />
      </td>
      <td>{name}</td>
      <td>
        <Button
          color="blue-link"
          onClick={handleTransactionInfo}
          name={transaction}
        />
      </td>
      <td>{signature.substr(-12)}</td>
      <td>{currentDate}</td>
      <td>{status}</td>
      <td className="align-right">
        <div className="btn-box inline">
          {isStatusAPL20 && (
            <button
              type={"button"}
              onClick={handleByMethod}
              className={`btn btn-green btn-sm`}
              id={`button-buy-${id}`}
            >
              Buy
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};
