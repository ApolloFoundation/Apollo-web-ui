/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */
import React, { useCallback } from "react";
import { useDispatch, useStore } from "react-redux";
import { useHistory } from "react-router-dom";
import { NotificationManager } from "react-notifications";
import { Contract } from "aplsmcjs";
import { formatTimestamp } from "../../../../helpers/util/time";
import { setBodyModalParamsAction } from "../../../../modules/modals";
import { getTransactionAction } from "../../../../actions/transactions";
import { addContractAction } from "../../../../actions/smart-contracts";
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
  const store = useStore();
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

  const handleAddEvent = useCallback(() => {
    try {
      let { host, protocol } = window.location;
      const isDev = process.env.NODE_ENV === "development";
      const protocolPrefix = protocol === "https:" || !isDev ? "wss:" : "ws:";
      const forProxy = isDev ? "socket/" : "";
      const smartContract = new Contract(
        {
          apiPath: `/rest/v2/smc/${address}/event`,
          socketPath: `${protocolPrefix}//${host}/${forProxy}smc/event/`,
        },
        address,
        {
          onContractConnectionClose: () => {
            const contractData = store.getState().smartContract.contractsData;
            if (contractData && contractData[address]) {
              smartContract.createConnection();
              console.log("do reconnect", address);
            } else {
              console.log("connection close for", address);
            }
          },
        }
      );
      dispatch(addContractAction(address, smartContract));
      NotificationManager.success("Event has been added", null, 10000);
    } catch (e) {
      console.log(e);
    }
  }, [dispatch, store]);

  return (
    <tr>
      <td>
        <div className="d-flex">
          <Button
          className="mr-2"
            color="blue-link"
            onClick={handleContractInfo}
            name={address}
          />
          <div className="pointer" onClick={handleAddEvent}>
            <i class="zmdi zmdi-notifications zmdi-hc-2x"></i>
          </div>
        </div>
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
