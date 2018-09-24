import React from 'react';
import {connect} from 'react-redux';
import uuid from 'uuid';
import {setBodyModalParamsAction} from "../../../modules/modals";
import {formatTimestamp} from "../../../helpers/util/time";
import {toEpochTime} from "../../../helpers/util/time"

const mapDispatchToProps = dispatch => ({
    formatTimestamp: (timestamp, date_only, isAbsoluteTime) => dispatch(formatTimestamp(timestamp, date_only, isAbsoluteTime)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
});

class Generator extends React.Component {
    state = {
        remaining: 0
    };

    initTimer = () => {
        const remaining = this.props.generator.deadline - (toEpochTime(undefined, this.props.epochB) - this.props.resTimestamps) + 20;
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
        return (
            <tr key={uuid}>
                <td className="blue-link-text align-left">
                    <a onClick={() => this.props.setBodyModalParamsAction('INFO_ACCOUNT', this.props.generator.account)}>{this.props.generator.accountRS}</a>
                </td>
                <td className="align-right">
                    <a>{this.props.generator.effectiveBalanceAPL.toLocaleString('en')}</a>
                </td>
                <td className="align-left">
                    <a>{this.props.formatTimestamp(this.props.generator.hitTime)}</a>
                </td>
                <td className="align-right"><a>{this.props.generator.deadline}</a>
                </td>
                <td className="align-right">
                    <a>{this.state.remaining}</a>
                </td>
            </tr>
        );
    }
}

export default connect(null, mapDispatchToProps)(Generator);