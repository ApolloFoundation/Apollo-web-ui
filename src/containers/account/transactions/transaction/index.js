/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import uuid from 'uuid';
import {connect} from 'react-redux'

import {setBodyModalParamsAction} from "../../../../modules/modals";
import {formatTimestamp} from "../../../../helpers/util/time";
import {formatTransactionType, getPhasingTransactionVoters} from "../../../../actions/transactions";
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

    state = {
        phasing: null,
        transaction: null,
    };

    componentDidMount() {
        if (this.props.phased) {
            this.getPhasingTransactionInfo();
        }
    }

    componentDidUpdate() {
        if (this.props.phased && this.props.transaction !== this.state.transaction) {
            this.getPhasingTransactionInfo();
        }
    }

    getPhasingTransactionInfo = async () => {
        let phasing = await getPhasingTransactionVoters({transaction: this.props.transaction});

        if (phasing) {
            this.setState({
                phasing: phasing.polls[0],
                transaction: this.props.transaction
            })
        }
    };

    async getBlock(type, blockHeight) {
        const requestParams = {
            height: blockHeight
        };

        const block = await this.props.getBlockAction(requestParams);

        if (block) {
            this.props.setBodyModalParamsAction('INFO_BLOCK', block)
        }
    }

    handleMouseOver = (selector) => {
        const el = document.querySelector(`[data-transaction="${selector}"]`);
        if (el) {
            el.classList.add('active');
        }
    };

    handleMouseOut = (selector) => {
        const el = document.querySelector(`[data-transaction="${selector}"]`);

        if (el) {
            el.classList.remove('active');
        }
    };


    render() {
        const {isUnconfirmed, timestamp, confirmations, amountATM, feeATM, sender, senderRS, recipient, recipientRS, constants, height, formatTimestamp, transaction, type, setBodyModalParamsAction, subtype, attachment} = this.props;
        const transactionType = constants.transactionTypes[type];
        return (
            <tr key={uuid()}>
                {
                    constants &&
                    <>
                        <td className="blue-link-text">
                            <a onClick={() =>
                                setBodyModalParamsAction('INFO_TRANSACTION', this.props, (type === 0 && subtype === 1))}
                            >
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
                            {
                                (amountATM === "0" && attachment.priceATM !== "0") ?
                                    attachment.priceATM / 100000000
                                    :
                                    amountATM / 100000000
                            }
                        </td>
                        <td className="align-right">
                            {feeATM / 100000000}
                        </td>
                        <td className="blue-link-text">
                            <a onClick={() => setBodyModalParamsAction('INFO_ACCOUNT', sender)}>
                                {senderRS}
                            </a>
                            &nbsp;
                            &nbsp;
                            <i className="zmdi zmdi-long-arrow-right"/>
                            &nbsp;
                            &nbsp;
                            <a onClick={() => setBodyModalParamsAction('INFO_ACCOUNT', recipient)}>
                                {recipientRS}
                            </a>
                        </td>
                        <td className="align-right phasing">

                            {this.state.phasing && (
                                <div className="phasing-box"
                                     style={{zIndex: 12}}
                                     data-custom-at="top"
                                     data-cat-id={JSON.stringify({...this.props.transaction, ...this.state.phasing})}
                                >
                                    <spna className="phasing-box__icon">
                                        <i className={'zmdi zmdi-accounts-alt'}/>
                                    </spna>
                                    &nbsp;
                                    &nbsp;
                                    <span className="phasing-box__result">
                                    {this.state.phasing.result} / {this.state.phasing.quorum}
                                </span>
                                </div>
                            )}
                        </td>

                        <td className="align-right blue-link-text">
                            {!isUnconfirmed ? (
                                <a onClick={this.getBlock.bind(this, 'INFO_BLOCK', height)}>
                                    {height}
                                </a>
                            ) : (
                                <span>---</span>
                            )}
                        </td>
                        <td className="align-right blue-link-text">
                            {confirmations}
                        </td>

                    </>
                }
            </tr>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Transaction);