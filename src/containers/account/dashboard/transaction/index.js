/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import classNamse from 'classnames';
import {formatTimestamp} from "../../../../helpers/util/time";
import {formatTransactionType} from "../../../../actions/transactions";
import {setBodyModalParamsAction} from "../../../../modules/modals";

const mapStateToProps = state => ({
    constants: state.account.constants,
    actualBlock: state.account.actualBlock,
    account: state.account.account,
    propsTypes: state
})

const mapDispatchToProps = dispatch => ({
    formatTimestamp: (timestamp, date_only, isAbsoluteTime) => dispatch(formatTimestamp(timestamp, date_only, isAbsoluteTime)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
});

const Transaction = (props) => (
    <a
        className="transaction-item" style={{position: 'relative'}}
        onClick={async () => props.getTransaction(props.transaction)}
    >
        <div className="transaction-box">
            <div className="transaction-date">
                <div className="date">
                    {props.formatTimestamp(props.timestamp)}
                    </div>
                <div className="transaction-amount">
                    {props.account === props.sender && props.amountATM != 0 && '-'}
                    {props.amountATM / 100000000}
                </div>
            </div>
            <div className="transaction-rs">
                {props.senderRS}
            </div>
            <div className={classNamse({
                'arrow':  true,
                'success': props.account !== props.sender,
                'danger': props.account === props.sender
            })}>
                <i className={'zmdi zmdi-forward'} />
            </div>
            <div className="transaction-rs">
                {
                    props.recipientRS &&
                    <div className="transaction-rs">{props.recipientRS}</div>
                }
                {
                    !(!!props.recipientRS) && props.type === 1 &&
                    <i className="zmdi zmdi-comments left"/>
                }
                {
                    !(!!props.recipientRS) && props.type === 2 &&
                    <i className="zmdi zmdi-case left"/>
                }
                {
                    !(!!props.recipientRS) && props.type === 3 &&
                    <i className="zmdi zmdi-label left"/>
                }
                {
                    !(!!props.recipientRS) && props.type === 5 &&
                    <i className="zmdi zmdi-money left"/>
                }
                {
                    !(!!props.recipientRS) && props.type === 6 &&
                    <i className="zmdi zmdi-dns left"/>
                }
                {
                    !(!!props.recipientRS) && props.type === 7 &&
                    <i className="zmdi zmdi-circle-o left"/>
                }
            </div>

            <div className="transaction-rs">{formatTransactionType(props.constants.transactionTypes[props.type].subtypes[props.subtype].name)}</div>
            <div className={'loader-container'}>
                    <span>
                        Confirmation
                    </span>
                {
                    props.actualBlock < props.height ?
                    <div className={'ball-pulse'}>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    :
                    props.confirmations
                }

            </div>


        </div>
    </a>
);

export default connect(mapStateToProps, mapDispatchToProps)(Transaction)