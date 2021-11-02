/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

import React from "react";
import { connect } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { setBodyModalParamsAction } from "../../../../modules/modals";
import { Link } from "react-router-dom";
import { formatTimestamp } from "../../../../helpers/util/time";
import Button from "../../../components/button";

const mapDispatchToProps = (dispatch) => ({
  setBodyModalParamsAction: (type, data, valueForModal) =>
    dispatch(setBodyModalParamsAction(type, data, valueForModal)),
  formatTimestamp: (time) => dispatch(formatTimestamp(time)),
});

const FinishedpollsItem = (props) => (
  <tr>
    <td className="blue-link-text">
      <Button
        color="blue-link"
        onClick={() =>
          props.setBodyModalParamsAction("INFO_TRANSACTION", props.poll)
        }
      >
        {props.name}
      </Button>
    </td>
    <td>
      {" "}
      {props.description.length > 100
        ? props.description.slice(0, 100) + "..."
        : props.description}{" "}
    </td>
    <td className="blue-link-text">
      <a
        onClick={() =>
          props.setBodyModalParamsAction("INFO_ACCOUNT", props.account)
        }
      >
        {" "}
        {props.accountRS}{" "}
      </a>
    </td>
    <td>{props.formatTimestamp(props.timestamp)}</td>
    <td className={"align-right"}>
      <div className="btn-box inline">
        <button
          type="button"
          onClick={() =>
            props.setBodyModalParamsAction("POLL_RESULTS", props.poll)
          }
          className="btn btn-default"
        >
          Results
        </button>
        <Link to={"/followed-polls/" + props.poll} className="btn btn-default">
          View
        </Link>
      </div>
    </td>
  </tr>
);

export default connect(null, mapDispatchToProps)(FinishedpollsItem);
