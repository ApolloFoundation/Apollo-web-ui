/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import uuid from 'uuid';
import crypto from '../../../../helpers/crypto/crypto'
import converters from '../../../../helpers/converters';
import {setBodyModalParamsAction} from "../../../../modules/modals";
import {connect} from 'react-redux'
import {formatTimestamp} from "../../../../helpers/util/time";
import {formatTransactionType} from "../../../../actions/transactions";
import {getBlockAction} from "../../../../actions/blocks";
import {ONE_APL} from '../../../../constants';

const mapStateToProps = state => ({
    constants: state.account.constants
});

const mapDispatchToProps = dispatch => ({
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    getBlockAction: (data) => dispatch(getBlockAction(data)),
    formatTimestamp: (timestamp, date_only, isAbsoluteTime) => dispatch(formatTimestamp(timestamp, date_only, isAbsoluteTime))
});

class Transaction extends React.Component {
    getBlock = async (blockHeight) => {
            this.props.setBodyModalParamsAction('INFO_BLOCK', blockHeight)
    }

    render () {
        const {
            feeATM,
            amountATM,
            subtype,
            type,
            transaction,
            constants,
            setTransactionInfo,
            formatTimestamp,
            timestamp,
            sender,
            senderRS,
            recipient,
            recipientRS,
            height,
            isUnconfirmed,
            setBodyModalParamsAction,
            attachment
        } = this.props;
        const transactionType = constants.transactionTypes[type];
        return (
            <tr key={uuid()}>
                {
                    transaction && constants &&
                    <React.Fragment>
                        <td className="blue-link-text">
                            <a onClick={() => setBodyModalParamsAction('INFO_TRANSACTION', transaction)}>
                                {formatTimestamp(timestamp)}
                            </a>
                        </td>
                        <td>
                            {
                                !!transactionType &&
                                (transactionType.subtypes[subtype].name === "AliasSell" && amountATM === "0" && attachment.priceATM === "0") ?
                                    formatTransactionType("AliasTransfer")
                                    :
                                    formatTransactionType(transactionType.subtypes[subtype].name)
                            }
                        </td>
                        <td className="align-right">
                            {amountATM / ONE_APL}
                        </td>
                        <td className="align-right">
                            {feeATM / ONE_APL}
                        </td>
                        <td className="blue-link-text">
                            <a onClick={setBodyModalParamsAction.bind(this, 'INFO_ACCOUNT', sender)}>{senderRS}</a>
                        </td>
                        <td className="blue-link-text">
	                        <a onClick={setBodyModalParamsAction.bind(this, 'INFO_ACCOUNT', recipient)}>{recipientRS}</a>
                        </td>
                        <td className="align-right blue-link-text">
                            {
                                !isUnconfirmed &&
                                <a onClick={() => setBodyModalParamsAction('INFO_BLOCK', height)}>{height}</a>
                            }
                            {
                                isUnconfirmed && '-'
                            }
                        </td>
                    </React.Fragment>
                }
            </tr>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Transaction);
