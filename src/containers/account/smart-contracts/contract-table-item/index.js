/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from "react";
import { v4 as uuidv4 } from "uuid";
import { setBodyModalParamsAction } from "../../../../modules/modals";

import { formatTimestamp } from "../../../../helpers/util/time";
import { useDispatch } from "react-redux";

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

  return (
    <tr key={uuidv4()}>
      <td>{address}</td>
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
            onClick={() => dispatch(setBodyModalParamsAction("CAST_VOTE", {}))}
            className={`btn btn-green btn-sm`}
          >
            Send message
          </button>
        </div>
      </td>
    </tr>
  );
};
