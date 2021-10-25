/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

import React from "react";
import { Link } from "react-router-dom";
import { setBodyModalParamsAction } from "../../../../modules/modals";
import { connect } from "react-redux";
import Button from "../../../components/button";

const mapStateToProps = (state) => ({
  decimals: state.account.decimals,
  ticker: state.account.ticker,
});

const mapDispatchToProps = (dispatch) => ({
  setBodyModalParamsAction: (type, data, valueForModal) =>
    dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

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

const getHoldingType = (props) => {
  switch (props.holdingType) {
    case 0:
      return props.ticker;
    case 1:
      return (
        <Link to={"/asset-exchange/" + props.holding}>
          {props.holding} (Asset)
        </Link>
      );
    case 2:
      return (
        <Link to={"/exchange-booth/" + props.holdingInfo.name}>
          {props.holding} (Currency)
        </Link>
      );
    default:
      return "";
  }
};

const ShufflingItem = (props) => {
  return (
    <tr>
      <td>
        <Button
          color="blue-link"
          onClick={() => props.getTransaction(props.shuffling)}
          name={props.shuffling}
        />
      </td>
      <td>{getStage(props.stage)}</td>
      <td className={"blue-link-text"}>
        {getHoldingType(props.holdingType, props.holding, props.ticker)}
      </td>
      <td>{props.amount / props.decimals}</td>
      {props.blocksRemaining ? <td>{props.blocksRemaining}</td> : null}

      <td className="align-right">
        {props.registrantCount} / {props.participantCount}
      </td>
      <td className="align-right">
        <Button
          color="blue-link"
          onClick={() =>
            props.setBodyModalParamsAction("INFO_ACCOUNT", props.issuer)
          }
          name={props.issuerRS}
        />
      </td>
      {props.blocksRemaining && props.stage !== 1 && (
        <td className="align-right">
          <div className="btn-box inline">
            <button
              className={"btn btn-default"}
              onClick={() =>
                props.setBodyModalParamsAction(
                  "START_SHUFFLING",
                  props.shuffling
                )
              }
            >
              Join
            </button>
          </div>
        </td>
      )}
      {props.blocksRemaining && props.stage === 1 && (
        <td className="align-right">In Progress</td>
      )}
    </tr>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ShufflingItem);
