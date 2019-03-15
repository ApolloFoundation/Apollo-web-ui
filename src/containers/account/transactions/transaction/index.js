/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import uuid from 'uuid';

import {setBodyModalParamsAction} from "../../../../modules/modals";
import {connect} from 'react-redux'
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

    state = {};
    
    componentDidMount () {
        if (this.props.phased) {
            this.getPhasingTransactionInfo();
        }
    }

    componentDidUpdate () {
        if (this.props.phased && !this.state.phasing) {
            this.getPhasingTransactionInfo();
        }
        if (!this.props.phased && this.state.phasing) {
            this.setState({
                phasing: null
            })
        }
    }

    getPhasingTransactionInfo = async () => {
        let phasing = await getPhasingTransactionVoters({transaction: this.props.transaction});

        if (phasing) {
            this.setState({
                phasing: phasing.polls[0]
            })
        }
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

    handleMouseOver = (selector) => {
        const el = document.querySelector(`[data-transaction="${selector}"]`);
        if (el) {
            el.classList.add('active');
        }
    }

    handleMouseOut = (selector) => {
        const el = document.querySelector(`[data-transaction="${selector}"]`)

        if (el) {
            el.classList.remove('active');
        }
    }


    render () {
        const {timestamp, confirmations, amountATM, feeATM, phased, sender, senderRS, recipient, recipientRS, constants, block, height, formatTimestamp, transaction, type, setBodyModalParamsAction, subtype} = this.props;

        return (
            <tr key={uuid()}>
                {
                    constants && block &&
                    <>
                        <td className="blue-link-text">
                            <a onClick={() => setBodyModalParamsAction('INFO_TRANSACTION', transaction, (type === 0 && subtype === 1))}>
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
                            {feeATM    / 100000000}
                        </td>
                        <td className="blue-link-text">
                            <a onClick={() => setBodyModalParamsAction('INFO_ACCOUNT', sender)}>
                                {senderRS}
                            </a>
                            &nbsp; 
                            &nbsp; 
                            <i class="zmdi zmdi-long-arrow-right" /> 
                            &nbsp; 
                            &nbsp; 
                            <a onClick={() => setBodyModalParamsAction('INFO_ACCOUNT', recipient)}>
                                {recipientRS}
                            </a>
                        </td>
                        <td className="align-right phasing">
                        
                        {
                            this.state.phasing && 
                            <div className="phasing-box"
                                style={{zIndex: 12}}
                                data-custom
                                data-custom-at="top"
                                data-cat-id={JSON.stringify({...this.props.transaction, ...this.state.phasing})}
                            >
                                <spna className="phasing-box__icon">
                                    <i className={'zmdi zmdi-accounts-alt'}></i>
                                </spna>
                                &nbsp; 
                                &nbsp; 
                                <span className="phasing-box__result">
                                    {this.state.phasing.result} / {this.state.phasing.quorum}
                                </span>
                            </div>


                        }
                        </td>

                        <td className="align-right blue-link-text">
                            <a onClick={() => setBodyModalParamsAction('INFO_BLOCK', height)}>
                                {height}
                            </a>
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