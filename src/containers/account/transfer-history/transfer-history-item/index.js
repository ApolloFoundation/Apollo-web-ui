/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

import React from "react";
import { useDispatch } from "react-redux";
import { setBodyModalParamsAction } from "../../../../modules/modals";
import { formatTimestamp } from "../../../../helpers/util/time";
import Button from "../../../components/button";

const TransferHistoryItem = (props) => {
  const dispatch = useDispatch();

  const {
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

  const handleInfoTransactionModal = () =>
    dispatch(setBodyModalParamsAction("INFO_TRANSACTION", assetTransfer));

  const handleInfoAccountModal = (props) =>
    dispatch(setBodyModalParamsAction("INFO_TRANSACTION", props));

  return (
    <tr>
      <td>
        <Button
          color="blue-link"
          onClick={handleInfoTransactionModal}
          name={assetTransfer}
        />
      </td>
      <td>
        {name}
        <span className="info pointer" />
      </td>
      <td>{formatTimestamp(timestamp)}</td>
      <td className="align-right">
        {(quantityATU / Math.pow(10, decimals)).toLocaleString("en", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}
      </td>
      <td>
        <Button
          name={recipientRS}
          color="blue-link"
          onClick={() => handleInfoAccountModal(recipient)}
        />
      </td>
      <td>
        <Button
          name={senderRS}
          color="blue-link"
          onClick={() => handleInfoAccountModal(sender)}
        />
      </td>
    </tr>
  );
};

export default TransferHistoryItem;
