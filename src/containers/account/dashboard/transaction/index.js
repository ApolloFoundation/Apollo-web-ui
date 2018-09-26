/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {formatTimestamp} from "../../../../helpers/util/time";
import {formatTransactionType} from "../../../../actions/transactions";

const mapStateToProps = state => ({
    constants: state.account.constants,
    actualBlock: state.account.actualBlock
})

const mapDispatchToProps = dispatch => ({
    formatTimestamp: (timestamp, date_only, isAbsoluteTime) => dispatch(formatTimestamp(timestamp, date_only, isAbsoluteTime))

});

const Transaction = (props) => (
    <div className="transaction-item" style={{position: 'relative'}}>
        <div className="transaction-box">
            <div className="transaction-date"><div className="date">{props.formatTimestamp(props.timestamp)}</div> <div className="transaction-amount">{props.amountATM / 100000000}</div></div>
            <div className="transaction-rs">{props.senderRS}</div>
            {
                props.actualBlock < props.height &&
                <div className={'loader-container'}>
                    <span>
                        Confirmation
                    </span>
                    <div className={'ball-pulse-sync'}>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </div>
            }
        </div>
    </div>
);

export default connect(mapStateToProps, mapDispatchToProps)(Transaction)