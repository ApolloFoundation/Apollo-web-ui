/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { setBodyModalParamsAction } from "../../../../modules/modals";
import { getTransactionAction } from "../../../../actions/transactions";
import { getSmcSpecification } from "../../../../actions/contracts";
import Button from "../../../components/button";

export const ContractTableItemTokens = ({
  address,
  symbol,
  transaction,
  balance,
  baseContract,
  id,
}) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const isStatusAPL20 =
    /^APL20BUY/.test(baseContract) || /^APL20LOCK/.test(baseContract);

  const handleContractInfo = () => {
    isStatusAPL20
      ? history.push(`/smart-contracts/explorer/${address}`)
      : dispatch(setBodyModalParamsAction("SMC_INFO", { address }));
  };

  const handleTransactionInfo = async () => {
    const transactionInfo = await dispatch(
      getTransactionAction({
        transaction,
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

  const handleTransferModal = () => {
    dispatch(setBodyModalParamsAction("SMC_TRANSFER", { address }));
  };

  return (
    <tr>
      <td>
        <Button color="blue-link" onClick={handleContractInfo} name={address} />
      </td>
      <td>{symbol}</td>
      <td>
        <Button
          color="blue-link"
          onClick={handleTransactionInfo}
          name={transaction}
        />
      </td>
      <td>{balance}</td>
      <td className="align-right">
        <div className="btn-box inline">
          <Button
            onClick={handleTransferModal}
            color="green"
            size="sm"
            id={`button-transfer-${id}`}
            name="Transfer"
          />
          {isStatusAPL20 && (
            <Button
              onClick={handleByMethod}
              color="green"
              size="sm"
              id={`button-buy-${id}`}
              name="Buy"
            />
          )}
        </div>
      </td>
    </tr>
  );
};
