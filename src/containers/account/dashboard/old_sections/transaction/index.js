/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import { connect } from 'react-redux';
import classNamse from 'classnames';
import { formatTimestamp } from "../../../../../helpers/util/time";
import { INIT_TRANSACTION_TYPES } from "../../../../../helpers/transaction-types/transaction-types-new";
import { formatTransactionType } from "../../../../../actions/transactions";
import { setBodyModalParamsAction } from "../../../../../modules/modals";
import {ONE_APL} from '../../../../../constants';

const mapStateToProps = state => ({
    constants: state.account.constants,
    actualBlock: state.account.actualBlock,
    account: state.account.account,
    propsTypes: state
});

const mapDispatchToProps = dispatch => ({
    formatTimestamp: (timestamp, date_only, isAbsoluteTime) => dispatch(formatTimestamp(timestamp, date_only, isAbsoluteTime)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

const Transaction = (props) => {
    const isDexOrder = !!props.constants.transactionTypes && props.constants.transactionTypes[props.type].subtypes[props.subtype].name === "DexOrder";
    const isAliasSell = !!props.constants.transactionTypes && props.constants.transactionTypes[props.type].subtypes[props.subtype].name === "AliasSell";

    const typeIcon = (type, subtype) => {
        return INIT_TRANSACTION_TYPES[type] ? INIT_TRANSACTION_TYPES[type].subTypes[subtype].iconHTML : '';
    };

    return (
        <a
            className="transaction-item"
            style={{ position: 'relative' }}
            onClick={async () => props.setBodyModalParamsAction('INFO_TRANSACTION', props.transaction)}
        >
            <div className="transaction-box">
                <div className="transaction-date">
                    <div className="date">
                        {props.formatTimestamp(props.timestamp)}
                    </div>
                    <div className="transaction-amount">
                        {props.account === props.sender && props.amountATM != 0 && '-'}
                        {
                            isDexOrder ?
                                `${props.attachment.offerCurrency === 0 ? "-" : ""}${props.attachment.offerAmount / ONE_APL}`
                                :
                                ((props.amountATM === "0" && props.attachment.priceATM && props.attachment.priceATM !== "0") ?
                                    props.attachment.priceATM
                                    : props.amountATM
                                ) / ONE_APL
                        }
                    </div>
                </div>
                <div className="transaction-rs">
                    {isDexOrder ?
                        props.attachment.offerCurrency === 0 ? props.senderRS : <i className="zmdi zmdi-trending-up left" />
                        :
                        props.senderRS
                    }
                </div>
                <div className={classNamse({
                    'arrow': true,
                    'success': (props.account !== props.sender) || (isDexOrder && props.attachment.offerCurrency !== 0),
                    'danger': (props.account === props.sender) || (isDexOrder && props.attachment.offerCurrency === 0)
                })}>
                    <i className={'zmdi zmdi-forward'} />
                </div>
                <div className="transaction-rs">
                    {isDexOrder ?
                        props.attachment.offerCurrency !== 0 ? props.senderRS : <i className="zmdi zmdi-trending-up left" />
                        :
                        props.recipientRS ?
                            <div className="transaction-rs">
                                {props.recipientRS}
                            </div>
                            :
                            typeIcon(props.type, props.subtype)
                    }
                </div>
                {
                    isAliasSell && props.amountATM === "0" && props.attachment.priceATM === "0" ?
                        <div className="transaction-rs">{formatTransactionType("AliasTransfer")}</div>
                        :
                        <div className="transaction-rs">{formatTransactionType(props.constants.transactionTypes[props.type].subtypes[props.subtype].name)}</div>
                }
                <div className={'loader-container'}>
                    <span>
                        Confirmation
                    </span>
                    {
                        props.actualBlock < props.height ?
                            <div className={'ball-pulse'}>
                                <div />
                                <div />
                                <div />
                            </div>
                            :
                            props.confirmations
                    }

                </div>
            </div>
        </a>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(Transaction)
