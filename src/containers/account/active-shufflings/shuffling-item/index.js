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
      <td>
        {props.stage === 0 && "Registration"}
        {props.stage === 1 && "Processing"}
        {props.stage === 4 && "Expired"}
        {props.stage === 5 && "Done"}
      </td>
      <td className={"blue-link-text"}>
        {props.holdingType === 0 && props.ticker}
        {props.holdingType === 1 && (
          <Link to={"/asset-exchange/" + props.holding}>
            {props.holding} (Asset)
          </Link>
        )}
        {props.holdingType === 2 && (
          <Link to={"/exchange-booth/" + props.holdingInfo.name}>
            {props.holding} (Currency)
          </Link>
        )}
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
      {props.blocksRemaining && props.stage !== 1 ? (
        <td className="align-right">
          <div className="btn-box inline">
            <Button
              onClick={() =>
                props.setBodyModalParamsAction(
                  "START_SHUFFLING",
                  props.shuffling
                )
              }
              name={"Join"}
            />
          </div>
        </td>
      ) : null}
      {props.blocksRemaining && props.stage === 1 ? (
        <td className="align-right">In Progress</td>
      ) : null}
    </tr>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ShufflingItem);
