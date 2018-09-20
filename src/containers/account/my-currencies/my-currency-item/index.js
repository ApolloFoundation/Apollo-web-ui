import React from 'react';
import uuid from 'uuid';
import crypto from "../../../../helpers/crypto/crypto";
import converters from "../../../../helpers/converters";
import {setBodyModalParamsAction} from "../../../../modules/modals";
import {connect} from 'react-redux';
import {formatTimestamp} from "../../../../helpers/util/time";

class MyCurrencytemItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            transfer: this.props.currency
        }
    }

    render () {
        if (this.state.transfer) {
            return (
                <tr key={uuid()}>
                    <td>{this.state.transfer.code}</td>
                    <td>{this.state.transfer.name}</td>
                    <td className="align-right">{(this.state.transfer.unconfirmedUnits / Math.pow(10, this.state.transfer.decimals)).toFixed(2)}</td>
                </tr>
            );
        } else {
            return (
                <tr key={uuid()}></tr>
            );
        }
    }
}

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    formatTimestamp: (timestamp, date_only, isAbsoluteTime) => dispatch(formatTimestamp(timestamp, date_only, isAbsoluteTime)),
});

export default connect(null, mapDispatchToProps)(MyCurrencytemItem);

