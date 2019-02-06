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
            setBodyModalParamsAction
        } = this.props;

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
                                !!constants.transactionTypes[type] &&
                                formatTransactionType(constants.transactionTypes[type].subtypes[subtype].name)
                            }
                        </td>
                        <td className="align-right">
                            {amountATM / 100000000}
                        </td>
                        <td className="align-right">
                            {feeATM / 100000000}
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