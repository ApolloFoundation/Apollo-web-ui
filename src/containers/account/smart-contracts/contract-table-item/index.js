/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from "react";
import { v4 as uuidv4 } from "uuid";
import { setBodyModalParamsAction } from "../../../../modules/modals";
import { getState } from "../../../../../src/actions/contracts";
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

  const showInfo = async (userRS) => {
    dispatch(
      setBodyModalParamsAction("SMC_INFO", { userRS })
    );
  };
  return (
    <tr key={uuidv4()}>
      <td onClick={() => showInfo(address)}>{address}</td>
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
            onClick={() =>
              dispatch(setBodyModalParamsAction("CREATE_SMC_EXECUTION", {}))
            }
            className={`btn btn-green btn-sm`}
          >
            Send message
          </button>
        </div>
      </td>
    </tr>
  );
};
