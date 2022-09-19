/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import {setBodyModalParamsAction} from "../../../modules/modals";
import {formatTimestamp} from "../../../helpers/util/time";
import {toEpochTime} from "../../../helpers/util/time"

const mapDispatchToProps = dispatch => ({
    formatTimestamp: (timestamp, date_only, isAbsoluteTime) => dispatch(formatTimestamp(timestamp, date_only, isAbsoluteTime)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

class Generator extends React.Component {
    state = {
        remaining: 0
    };

    initTimer = () => {
        const remaining = this.props.deadline - (toEpochTime(undefined, this.props.epochB) - this.props.resTimestamps) + 20;
        this.setState({
            remaining
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
        const {setBodyModalParamsAction, account, accountRS, effectiveBalanceAPL, hitTime, deadline} = this.props;
        return (
            <tr>
                <td className="blue-link-text align-left">
                    <a onClick={() => setBodyModalParamsAction('INFO_ACCOUNT', account)}>{accountRS}</a>
                </td>
                <td className="align-right">
                    <a>{effectiveBalanceAPL.toLocaleString('en')}</a>
                </td>
                <td className="align-right">
                    <a>{this.props.formatTimestamp(hitTime)}</a>
                </td>
                <td className="align-right"><a>{deadline}</a>
                </td>
                {/* <td className="align-right">
                    <a>{this.state.remaining}</a>
                </td> */}
            </tr>
        );
    }
}

export default connect(null, mapDispatchToProps)(Generator);
