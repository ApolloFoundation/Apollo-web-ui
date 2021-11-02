import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { setBodyModalParamsAction } from "../../../../modules/modals";
import Button from "../../../components/button";

const ShufflingItem = (props) => {
  const dispatch = useDispatch();
  const { decimals, ticker } = useSelector((state) => state.account);

  const {
    getTransaction,
    shuffling,
    stage,
    holdingType,
    holding,
    holdingInfo,
    blocksRemaining,
    registrantCount,
    participantCount,
    issuer,
    issuerRS,
    amount,
  } = props;

  const getStage = (stage) => {
    switch (stage) {
      case 0:
        return "Registration";
      case 1:
        return "Processing";
      case 4:
        return "Expired";
      case 5:
        return "Done";
      default:
        return "";
    }
  };

  const getHoldingType = (holdingType) => {
    switch (holdingType) {
      case 0:
        return ticker;
      case 1:
        return <Link to={"/asset-exchange/" + holding}>{holding} (Asset)</Link>;
      case 2:
        return (
          <Link to={"/exchange-booth/" + holdingInfo.name}>
            {holding} (Currency)
          </Link>
        );
      default:
        return "";
    }
  };

  const handleInfoAccountModal = () => {
    dispatch(setBodyModalParamsAction("INFO_ACCOUNT", issuer));
  };

  const handleGetTransaction = () => getTransaction(shuffling);

  return (
    <tr>
      <td>
        <Button
          name={shuffling}
          color="blue-link"
          onClick={handleGetTransaction}
        />
      </td>
      <td>{getStage(stage)}</td>
      <td className={"blue-link-text"}>{getHoldingType(holdingType)}</td>
      <td>{amount / decimals}</td>
      <td>{blocksRemaining || ""}</td>
      <td className="align-right">
        {registrantCount} / {participantCount}
      </td>
      <td className="align-right">
        <Button
          name={issuerRS}
          color="blue-link"
          onClick={handleInfoAccountModal}
        />
      </td>
    </tr>
  );
};

export default ShufflingItem;
