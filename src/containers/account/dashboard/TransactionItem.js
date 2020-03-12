import React from 'react';
import {connect} from 'react-redux';
import classNamse from 'classnames';
import {formatTimestamp} from "../../../helpers/util/time";
import {formatTransactionType} from "../../../actions/transactions";
import {setBodyModalParamsAction} from "../../../modules/modals";
import {ONE_APL} from '../../../constants';
import {ReactComponent as ArrowIcon} from '../../../assets/arrow-right-long.svg';

const mapStateToProps = state => ({
    constants: state.account.constants,
    actualBlock: state.account.actualBlock,
    account: state.account.account,
    accountRS: state.account.accountRS,
    propsTypes: state
});

const mapDispatchToProps = dispatch => ({
    formatTimestamp: (timestamp, date_only, isAbsoluteTime) => dispatch(formatTimestamp(timestamp, date_only, isAbsoluteTime)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

const TransactionItem = (props) => {
    const isDexOrder = !!props.constants.transactionTypes && props.constants.transactionTypes[props.type].subtypes[props.subtype].name === "DexOrder";
    const isAliasSell = !!props.constants.transactionTypes && props.constants.transactionTypes[props.type].subtypes[props.subtype].name === "AliasSell";
    const senderRS = (props.senderRS && props.senderRS === props.accountRS) ? 'You' : props.senderRS;
    const recipientRS = (props.recipientRS && props.recipientRS === props.accountRS) ? 'You' : props.recipientRS;
    const transactionType = props.constants.transactionTypes && formatTransactionType(props.constants.transactionTypes[props.type].subtypes[props.subtype].name);
    const marketplaceTypes = ['DIGITAL GOODS DELISTING', 'DIGITAL GOODS PURCHASE', 'DIGITAL GOODS PRICE CHANGE', 'DIGITAL GOODS LISTING', 'DIGITAL GOODS QUANTITY CHANGE'];

    return (
        <div
            className="transaction-item cursor-pointer"
            onClick={async () => props.setBodyModalParamsAction('INFO_TRANSACTION', props.transaction)}
        >
            <div className="transaction-box">
                <div className={'d-flex justify-content-between mb-2'}>
                    <div className={''}>
                        {isAliasSell && props.amountATM === "0" && props.attachment.priceATM === "0" ? (
                            <div className="transaction-type">
                                {formatTransactionType("AliasTransfer")}
                            </div>
                        ) : (
                            <div className="transaction-type">
                                {transactionType}
                            </div>
                        )}
                        <div className="transaction-date">
                            {props.formatTimestamp(props.timestamp)}
                        </div>
                        <div className={'transaction-confirmation'}>
                            <span>Confirmation:&nbsp;</span>
                            {props.actualBlock < props.height ? (
                                <div className={'ball-pulse'}>
                                    <div/>
                                    <div/>
                                    <div/>
                                </div>
                            ) : (
                                props.confirmations
                            )}
                        </div>
                    </div>
                    <div
                        className={classNamse({
                            'transaction-amount': true,
                            'success': (props.account !== props.sender) || (isDexOrder && props.attachment.offerCurrency !== 0),
                            'danger': (props.account === props.sender) || (isDexOrder && props.attachment.offerCurrency === 0)
                        })}>
                        {
                            isDexOrder ?
                            `${props.attachment.offerCurrency === 0 ? "-" : ""}${props.attachment.offerAmount / ONE_APL}`
                            :
                            `${props.account === props.sender ? "-" : ""}${(
                                ((props.amountATM === "0" && props.attachment.priceATM && props.attachment.priceATM !== "0") ?
                                props.attachment.priceATM
                                : props.amountATM
                                ) / ONE_APL
                            )}`
                        }
                        {marketplaceTypes.includes(transactionType) && 
                            <div className={'transaction-confirmation fee'}>
                                <span className={'price'}>Price for listing:</span> {props.feeATM / ONE_APL}
                            </div>}
                    </div>
                </div>
                <div className={'transaction-rs-wrap d-flex justify-content-between align-items-center'}>
                    <div className={senderRS === 'You' ? 'transaction-you mr-2' : 'transaction-rs text-ellipsis mr-2'}>
                        {isDexOrder ? (
                            props.attachment.offerCurrency === 0 ? senderRS : <div className={'transaction-type text-ellipsis'}>{transactionType}</div>
                        ) : (
                            senderRS
                        )}
                    </div>
                    <div
                        className={classNamse({
                            'arrow': true,
                            'success': (props.account !== props.sender) || (isDexOrder && props.attachment.offerCurrency !== 0),
                            'danger': (props.account === props.sender) || (isDexOrder && props.attachment.offerCurrency === 0)
                        })}>
                    <ArrowIcon
                    />
                    </div>
                    <div className={recipientRS === 'You' ? 'transaction-you ml-2' : 'transaction-rs text-ellipsis ml-2'}>
                        {isDexOrder ? (
                            props.attachment.offerCurrency !== 0 ? senderRS : <div className={'transaction-type text-ellipsis'}>{transactionType}</div>
                        ) : (
                            props.recipientRS ? (
                                <span>{recipientRS}</span>
                            ) : (
                                <div className={'transaction-type text-ellipsis'}>{transactionType}</div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(TransactionItem)
