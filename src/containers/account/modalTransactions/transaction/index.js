/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux'
import {setBodyModalParamsAction} from "modules/modals";
import {formatTimestamp} from "helpers/util/time";
import {formatTransactionType} from "actions/transactions";
import { getConstantsSelector, getDecimalsSelector } from 'selectors';

const mapStateToProps = state => ({
    constants: getConstantsSelector(state),
    decimals: getDecimalsSelector(state),
});

const mapDispatchToProps = {
    setBodyModalParamsAction,
    formatTimestamp
};

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
            formatTimestamp,
            timestamp,
            sender,
            senderRS,
            recipient,
            recipientRS,
            height,
            isUnconfirmed,
            setBodyModalParamsAction,
            attachment,
            decimals,
        } = this.props;
        const transactionType = constants.transactionTypes && constants.transactionTypes[type];
        return (
            <tr>
                {
                    transaction && constants &&
                    <React.Fragment>
                        <td className="blue-link-text">
                            <a onClick={() => setBodyModalParamsAction('INFO_TRANSACTION', transaction)}>
                                {formatTimestamp(timestamp)}
                            </a>
                        </td>
                        <td>
                            {!!transactionType && (
                                (transactionType.subtypes[subtype].name === "AliasSell" && amountATM === "0" && attachment.priceATM === "0") ?
                                    formatTransactionType("AliasTransfer")
                                    :
                                    formatTransactionType(transactionType.subtypes[subtype].name)
                            )}
                        </td>
                        <td className="align-right">
                            {amountATM / decimals}
                        </td>
                        <td className="align-right">
                            {feeATM / decimals}
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
