/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from "react";
import { connect } from "react-redux";
import { setBodyModalParamsAction } from "../../../../modules/modals";
import Button from "../../../components/button";

const mapStateToProps = (state) => ({
  decimals: state.account.decimals,
  ticker: state.account.ticker,
});

const mapDispatchToProps = (dispatch) => ({
  setBodyModalParamsAction: (type, data, valueForModal) =>
    dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

const MarketplaceTableItem = (props) => (
  <tr>
    <td>
      <Button
        color="blue-link"
        onClick={() =>
          props.setBodyModalParamsAction("INFO_TRANSACTION", props.goods)
        }
        name={props.name}
      />
    </td>
    <td className="align-right">{props.quantity}</td>
    <td className="align-right">
      {Math.floor(props.priceATM / props.decimals).toLocaleString("it")}{" "}
      {props.ticker}
    </td>
    <td className="align-right">
      <div className="btn-box inline">
        <button
          type="button"
          onClick={() =>
            props.setBodyModalParamsAction("CHANGE_PRICE", props.goods)
          }
          className="btn btn-default"
        >
          Change Price
        </button>
        <button
          type="button"
          onClick={() =>
            props.setBodyModalParamsAction("CHANGE_QUANTITY", props.goods)
          }
          className="btn btn-default"
        >
          Change QTY
        </button>
        <button
          type="button"
          onClick={() =>
            props.setBodyModalParamsAction("DELETE_GOODS", props.goods)
          }
          className="btn btn-default"
        >
          Delete
        </button>
      </div>
    </td>
  </tr>
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MarketplaceTableItem);
