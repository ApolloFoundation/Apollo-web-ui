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
    constructor(props) {
        super(props);
    }

    async getBlock(type, blockHeight) {
        const requestParams = {
            height: blockHeight
        };

        const block = await this.props.getBlockAction(requestParams);

        if (block) {
            this.props.setBodyModalParamsAction('INFO_BLOCK', block)
        }
    }

    render () {
        return (
            <tr key={uuid()}>
                {
                    this.props.transaction && this.props.constants &&
                    <React.Fragment>
                        <td className="blue-link-text">
                            <a onClick={() => this.props.setTransactionInfo('INFO_TRANSACTION', this.props.transaction.transaction, (this.props.transaction.type === 0 && this.props.transaction.subtype === 1))}>
                                {this.props.formatTimestamp(this.props.transaction.timestamp)}
                            </a>
                        </td>
                        <td>
                            {
                                !!this.props.constants.transactionTypes[this.props.transaction.type] &&
                                formatTransactionType(this.props.constants.transactionTypes[this.props.transaction.type].subtypes[this.props.transaction.subtype].name)
                            }
                        </td>
                        <td className="align-right">
                            {this.props.transaction.amountATM / 100000000}
                        </td>
                        <td className="align-right">
                            {this.props.transaction.feeATM    / 100000000}
                        </td>
                        <td className="blue-link-text">
                            <a onClick={this.props.setBodyModalParamsAction.bind(this, 'INFO_ACCOUNT', this.props.transaction.sender)}>{this.props.transaction.senderRS}</a>
                        </td>
                        <td className="blue-link-text">
	                        <a onClick={this.props.setBodyModalParamsAction.bind(this, 'INFO_ACCOUNT', this.props.transaction.recipient)}>{this.props.transaction.recipientRS}</a>
                        </td>
                        <td className="align-right blue-link-text">
                            {
                                !this.props.isUnconfirmed &&
                                <a onClick={this.getBlock.bind(this, 'INFO_BLOCK', this.props.transaction.height)}>{this.props.transaction.height}</a>
                            }
                            {
                                this.props.isUnconfirmed && '-'
                            }
                        </td>

                        <td className="align-right">
                            {
                                !this.props.isUnconfirmed &&
                                <a>{this.props.transaction.confirmations}</a>
                            }
                            {
                                this.props.isUnconfirmed && '-'
                            }
                        </td>
                    </React.Fragment>
                }
            </tr>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Transaction);