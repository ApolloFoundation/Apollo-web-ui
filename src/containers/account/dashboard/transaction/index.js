import React from 'react';
import {connect} from 'react-redux';
import {formatTimestamp} from "../../../../helpers/util/time";
import {formatTransactionType} from "../../../../actions/transactions";

const mapStateToProps = state => ({
    constants: state.account.constants
})

const mapDispatchToProps = dispatch => ({
    formatTimestamp: (timestamp, date_only, isAbsoluteTime) => dispatch(formatTimestamp(timestamp, date_only, isAbsoluteTime))

});

const Transaction = (props) => (
    <div className="transaction-item">
        <div className="transaction-box">
            <div className="transaction-date">{props.formatTimestamp(props.timestamp)}</div>
            <div className="transaction-rs">{props.senderRS}</div>
            <div className="transaction-amount">{props.amountATM / 100000000}</div>
        </div>
    </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(Transaction)