import React from "react";
import { connect } from "react-redux";

import { setBodyModalParamsAction } from "../../../../modules/modals";
import Button from "../../../components/button";

const mapDispatchToProps = (dispatch) => ({
  setBodyModalParamsAction: (type, data) =>
    dispatch(setBodyModalParamsAction(type, data)),
});

const FundingMonitorItem = (props) => (
  <tr>
    <td>
      <Button
        color="blue-link"
        onClick={() =>
          props.setBodyModalParamsAction("INFO_ACCOUNT", props.recipient)
        }
        name={props.recipientRS}
      />
    </td>
    <td>{props.property}</td>
    <td>{props.value ? props.value : "-"}</td>
    <td className="align-right">
      <div className="btn-box inline">
        <Button
          color="blue-link"
          onClick={() =>
            props.setBodyModalParamsAction("REMOVE_MONITOR", {
              recipient: props.recipient,
              property: props.property,
            })
          }
          name={"Remove"}
        />
      </div>
    </td>
  </tr>
);

export default connect(null, mapDispatchToProps)(FundingMonitorItem);
