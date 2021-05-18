/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from "react";
import { v4 as uuidv4 } from "uuid";
import { setBodyModalParamsAction } from "../../../../modules/modals";
import { formatTimestamp } from "../../../../helpers/util/time";
import { useDispatch } from "react-redux";
import Button from "../../../components/button";

export const ContractTableItem = (props) => {
  const dispatch = useDispatch();

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

  const currentDate = dispatch(formatTimestamp(new Date(timestamp)));

  const handleContractInfo = () =>
    dispatch(setBodyModalParamsAction("SMC_INFO", { address }));
  const handleSendMessage = () =>
    dispatch(setBodyModalParamsAction("SMC_CREATE", { address }));

  return (
    <tr key={uuidv4()}>
      <td className="blue-link-text">
        <Button color="blue-link" onClick={handleContractInfo} name={address} />
      </td>
      <td>{name}</td>
      <td>{params}</td>
      <td>
        {fuelLimit} / {fuelPrice}
      </td>
      <td>{transaction}</td>
      <td>{amount}</td>
      <td>{signature.substring(0, 12)}</td>
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
