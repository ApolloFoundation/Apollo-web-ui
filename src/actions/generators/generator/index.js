/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

import React from "react";
import { connect } from "react-redux";
import { setBodyModalParamsAction } from "../../../modules/modals";
import { formatTimestamp } from "../../../helpers/util/time";
import { toEpochTime } from "../../../helpers/util/time";
import Button from "../../../containers/components/button";

const mapDispatchToProps = (dispatch) => ({
  formatTimestamp: (timestamp, date_only, isAbsoluteTime) =>
    dispatch(formatTimestamp(timestamp, date_only, isAbsoluteTime)),
  setBodyModalParamsAction: (type, data, valueForModal) =>
    dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

class Generator extends React.Component {
  state = {
    remaining: 0,
  };

  initTimer = () => {
    const remaining =
      this.props.deadline -
      (toEpochTime(undefined, this.props.epochB) - this.props.resTimestamps) +
      20;
    this.setState({
      remaining,
    });
  };

  timer = {};

  componentDidMount() {
    this.timer = setInterval(this.initTimer, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const {
      setBodyModalParamsAction,
      account,
      accountRS,
      effectiveBalanceAPL,
      hitTime,
      deadline,
    } = this.props;
    return (
      <tr>
        <td className="align-left">
          <Button
            color="blue-link"
            onClick={() => setBodyModalParamsAction("INFO_ACCOUNT", account)}
            name={accountRS}
          />
        </td>
        <td className="align-right">
          {effectiveBalanceAPL.toLocaleString("en")}
        </td>
        <td className="align-right">{this.props.formatTimestamp(hitTime)}</td>
        <td className="align-right">{deadline}</td>
      </tr>
    );
  }
}

export default connect(null, mapDispatchToProps)(Generator);
