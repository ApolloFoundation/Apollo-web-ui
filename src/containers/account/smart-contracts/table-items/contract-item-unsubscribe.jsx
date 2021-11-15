import React from "react";
import { useDispatch } from "react-redux";
import { removeEventAction } from "../../../../actions/smart-contracts";
import Button from "../../../components/button";

const ContractItemUn = ({ contractInstanse, contractId, id, description, ...event }) => {
  const dispatch = useDispatch();

  const handleUnsubscribe = (event) => () => {
    contractInstanse.removeEvent(event, (err, data) => {
      if (!err) {
        dispatch(removeEventAction(contractId, event));
      }
    });
  };

  return (
    <>
      <tr >
        <td>{event.name || "-"}</td>
        <td>{description}</td>
        <td>{event.fromBlock}</td>
        <td className="align-right">
          <div className="btn-box inline">
            <Button
              type="button"
              color="green"
              name="Unsubscribe"
              size="sm"
              onClick={handleUnsubscribe(event)}
            />
          </div>
        </td>
      </tr>
    </>
  );
};

export default ContractItemUn;
