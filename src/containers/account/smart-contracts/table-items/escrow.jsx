/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { formatTimestamp } from "../../../../helpers/util/time";
import { setBodyModalParamsAction } from "../../../../modules/modals";
import { getTransactionAction } from "../../../../actions/transactions";
import Button from "../../../components/button";

const TableItemEscrow = ({
  address,
  timestamp,
  transaction,
  signature,
  status,
  id,
}) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const currentDate = dispatch(formatTimestamp(new Date(timestamp)));

  const handleTransactionInfo = async () => {
    const transactionInfo = await dispatch(
      getTransactionAction({ transaction })
    );
    if (transactionInfo) {
      dispatch(setBodyModalParamsAction("INFO_TRANSACTION", transactionInfo));
    }
  };

  const handleTransferModal = () => {
    dispatch(setBodyModalParamsAction("SMC_TRANSFER", { address }));
  };

  const handleContractInfo = () => {
    history.push(`/smart-contracts/explorer/escrow/${address}`);
  };

  return (
    <tr>
      <td>
        <Button color="blue-link" onClick={handleContractInfo} name={address} />
      </td>
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
          <Button
            onClick={handleTransferModal}
            color="green"
            size="sm"
            id={`button-transfer-${id}`}
            name="Deposit"
          />
        </div>
      </td>
    </tr>
  );
};
export default TableItemEscrow;
