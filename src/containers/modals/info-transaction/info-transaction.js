/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {setBodyModalParamsAction, setModalData, openPrevModal} from '../../../modules/modals';
import classNames from 'classnames';
import {formatTransactionType, getTransactionAction} from "../../../actions/transactions";
import {formatTimestamp} from "../../../helpers/util/time";
import InfoTransactionTable from "./info-transoction-table"
import {getAccountInfoAction} from "../../../actions/account";
import {ONE_APL} from '../../../constants';

import CustomTable from '../../components/tables/table';
import TabulationBody from '../../components/tabulator/tabuator-body';
import TabContaier from '../../components/tabulator/tab-container';

class InfoLedgerTransaction extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: 0,
            transaction: null,
        };

        this.handleTab = this.handleTab.bind(this);
    }

    handleTab(e, index) {
        e.preventDefault();

        this.setState({
            ...this.props,
            activeTab: index
        })
    }

    processTransaction = async () => {
        const transaction = await this.props.getTransaction({transaction : this.state.transaction});
        this.setState({transaction});
    };

    static getDerivedStateFromProps(props, state) {
        if (props.modalData && Object.keys(props.modalData).length > 0 && (!state.transaction || props.modalData !== state.modalData)) {
            if (props.modalData && !props.modalData.errorCode) {
                return {
                    modalData: props.modalData,
                    transaction: props.modalData
                };
            }
        }
        return null;
    };

    componentDidMount() {
        if (this.state.transaction && !(this.state.transaction instanceof Object)) {
            this.processTransaction();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.transaction && prevState.transaction !== this.state.transaction) {
            if (!(this.state.transaction instanceof Object)) {
                this.processTransaction();
            }
        }
        if (this.state.transaction && this.state.transaction.phased && this.state.transaction !== prevState.transaction) {
            this.getWhiteListOfTransaction();
        }
    };

    getWhiteListOfTransaction = () => {
        if (this.state.transaction && this.state.transaction.attachment.phasingWhitelist) {
            const whitelist = this.state.transaction.attachment.phasingWhitelist.map((el) => {
                return this.props.getAccountInfoAction({
                    account: el
                })
            });

            Promise.all(whitelist)
                .then((data) => {
                    this.setState({
                        whitelist: data
                    })
                })
        }
    };

    render() {
        return (
            <div className="modal-box wide">
                {
                    this.state.transaction && this.props.constants.transactionTypes && this.props.constants.transactionTypes[this.state.transaction.type] &&
                    <form className="modal-form">
                        <div className="form-group-app media-tab">
                            <a onClick={() => this.props.closeModal()} className="exit">
                                <i className="zmdi zmdi-close" /></a>

                            <div className="form-title">
	                            {this.props.modalsHistory.length > 1 &&
	                            <div className={"backMy"} onClick={() => {this.props.openPrevModal()}}></div>
	                            }
                                <p>Transaction {this.state.transaction.transaction} Info</p>
                            </div>

                            <TabulationBody>

                                <TabContaier sectionName={'Info'}>
                                    <div className="transaction-table no-min-height transparent">
                                        <InfoTransactionTable transaction={this.state.transaction} constants={this.props.constants}/>
                                    </div>
                                </TabContaier>

                                <TabContaier sectionName={'Actions'}>
                                    {
                                        this.state.transaction &&
                                        <div className="flexible-grid">
                                            {this.state.transaction.recipientRS ?
                                                <a
                                                    onClick={() => this.props.setBodyModalParamsAction('SEND_APOLLO', {recipient: this.props.accountRS === this.state.transaction.recipientRS ? this.state.transaction.senderRS : this.state.transaction.recipientRS})}
                                                    className="btn btn-primary blue static"
                                                >
                                                    Send Apollo
                                                </a>
                                                :
                                                <a className="btn btn-primary blue-disabled static">Send Apollo</a>
                                            }
                                            {this.state.transaction.recipientRS ?
                                                <a
                                                    onClick={() => this.props.setBodyModalParamsAction('COMPOSE_MESSAGE', {recipient: this.props.accountRS === this.state.transaction.recipientRS ? this.state.transaction.senderRS : this.state.transaction.recipientRS})}
                                                    className="btn btn-primary blue static">
                                                    Send a message
                                                </a>
                                                :
                                                <a className="btn btn-primary blue-disabled static">Send a message</a>
                                            }
                                            {this.state.transaction.recipientRS ?
                                                <a
                                                    onClick={() => this.props.setBodyModalParamsAction('SAVE_ACCOUNT', this.props.accountRS === this.state.transaction.recipientRS ? this.state.transaction.senderRS : this.state.transaction.recipientRS)}
                                                    className="btn btn-primary blue static">
                                                    Add as contact
                                                </a>
                                                :
                                                <a className="btn btn-primary blue-disabled static">Add as contact</a>
                                            }
                                            <a className="btn btn-primary blue-disabled static">Send currency to sender</a>
                                            <a className="btn btn-primary blue-disabled static">Send a message to sender</a>
                                            <a className="btn btn-primary blue-disabled static">Apptove transaction</a>
                                            <a className="btn btn-primary blue-disabled static">Extend data lifetime</a>
                                        </div>
                                    }
                                </TabContaier>

                                <TabContaier sectionName={'Transactions Details'}>
                                    <div className="transaction-table no-min-height transparent">
                                        <div className="transaction-table-body transparent full-info">
                                            <table>
                                                <tbody>
                                                <tr>
                                                    <td>Sender public key:</td>
                                                    <td>{this.state.transaction.senderPublicKey}</td>
                                                </tr>
                                                <tr>
                                                    <td>Signature:</td>
                                                    <td className={'no-white-space'}><span className={'break-word'}>{this.state.transaction.signature}</span></td>
                                                </tr>
                                                <tr>
                                                    <td>Fee ATM:</td>
                                                    <td>{this.state.transaction.feeATM / ONE_APL}</td>
                                                </tr>
                                                <tr>
                                                    <td>Transaction index:</td>
                                                    <td>?</td>
                                                </tr>
                                                <tr>
                                                    <td>Confirmations:</td>
                                                    <td>{this.state.transaction.confirmations}</td>
                                                </tr>
                                                <tr>
                                                    <td>Full Hash:</td>
                                                    <td className={'no-white-space break-word'}>{this.state.transaction.fullHash}</td>
                                                </tr>
                                                <tr>
                                                    <td>Type:</td>
                                                    <td>{this.state.transaction.type}</td>
                                                </tr>
                                                <tr>
                                                    <td>Subtype:</td>
                                                    <td>{this.state.transaction.subtype}</td>
                                                </tr>
                                                <tr>
                                                    <td>Version:</td>
                                                    <td>{this.state.transaction.version}</td>
                                                </tr>
                                                <tr>
                                                    <td>Phased:</td>
                                                    <td>{this.state.transaction.phased ? 'true' : 'false'}</td>
                                                </tr>
                                                <tr>
                                                    <td>EC block id:</td>
                                                    <td className={'no-white-space break-word'}>{this.state.transaction.ecBlockId}</td>
                                                </tr>
                                                <tr>
                                                    <td>Signature hash:</td>
                                                    <td className={'no-white-space'}><span className={'break-word'}>{this.state.transaction.signatureHash}</span></td>
                                                </tr>

                                                <tr>
                                                    <td>Sender RS:</td>
                                                    <td>{this.state.transaction.senderRS}</td>
                                                </tr>
                                                {
                                                    this.state.transaction.recipientRS &&
                                                    <tr>
                                                        <td>Recipient RS:</td>
                                                        <td>{this.state.transaction.recipientRS}</td>
                                                    </tr>
                                                }
                                                {
                                                    this.state.transaction.amountATM &&
                                                    <tr>
                                                        <td>Amount ATM:</td>
                                                        <td>
                                                            {
                                                                (this.state.transaction.amountATM === "0" && this.state.transaction.attachment.priceATM) ?
                                                                    this.state.transaction.attachment.priceATM  / ONE_APL
                                                                    :
                                                                    this.state.transaction.amountATM / ONE_APL
                                                            }
                                                        </td>
                                                    </tr>
                                                }
                                                <tr>
                                                    <td>Sender:</td>
                                                    <td>{this.state.transaction.senderRS}</td>
                                                </tr>
                                                <tr>
                                                    <td>EC block height:</td>
                                                    <td>{this.state.transaction.ecBlockHeight}</td>
                                                </tr>
                                                <tr>
                                                    <td>Block:</td>
                                                    <td>{this.state.transaction.block}</td>
                                                </tr>

                                                <tr>
                                                    <td>Block timestamp:</td>
                                                    <td>{this.state.transaction.blockTimestamp}</td>
                                                </tr>
                                                <tr>
                                                    <td>Transaction Time:</td>
                                                    <td>{this.state.transaction.blockTimestamp}</td>
                                                </tr>

                                                <tr>
                                                    <td>Block generation time:</td>
                                                    <td>{this.props.formatTimestamp(this.state.transaction.timestamp)}</td>
                                                </tr>

                                                <tr>
                                                    <td>Deadline:</td>
                                                    <td>{this.state.transaction.deadline}</td>
                                                </tr>
                                                <tr>
                                                    <td>Timestamp:</td>
                                                    <td>{this.state.transaction.timestamp}</td>
                                                </tr>
                                                <tr>
                                                    <td>Height:</td>
                                                    <td>{this.state.transaction ? this.state.transaction.height : '-'}</td>
                                                </tr>

                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </TabContaier>
                                {
                                    this.state.transaction &&
                                    this.state.transaction.attachment &&
                                    this.state.transaction.phased &&
                                    <TabContaier sectionName={'Phasing Details'}>

                                        <div className="transaction-table no-min-height transparent">
                                            <div className="transaction-table-body transparent full-info">
                                                <table>
                                                    <tbody>
                                                    <tr>
                                                        <td>Phasing Finish Height:</td>
                                                        <td>{this.state.transaction.attachment.phasingFinishHeight}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Voting Model:</td>
                                                        <td>
                                                            {this.state.transaction.attachment.phasingVotingModel === 0 && 'ACCOUNT'}
                                                            {this.state.transaction.attachment.phasingVotingModel === 1 && 'ACCOUNT BALANCE'}
                                                            {this.state.transaction.attachment.phasingVotingModel === 2 && 'ASSET BALANCE'}
                                                            {this.state.transaction.attachment.phasingVotingModel === 3 && 'CURRENCY BALANCE'}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Quorum:</td>
                                                        <td>{this.state.transaction.attachment.phasingQuorum}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Minimum Balance:</td>
                                                        <td>{this.state.transaction.attachment.phasingMinBalance}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Whitelist:</td>
                                                        <td>
                                                            <div className={'transaction-table no-min-height'}>
                                                                <div className={'transaction-table-body transparent no-border-top'}>
                                                                    <table>
                                                                        <thead>
                                                                        <tr>
                                                                            <td style={{padding: '20px 0 20px', border: 0}}>Account</td>
                                                                        </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                        {
                                                                            this.state.whitelist &&
                                                                            this.state.whitelist.map((el) => {
                                                                                return (
                                                                                    <tr>
                                                                                        <td className={'blue-link-text'}>
                                                                                            <a
                                                                                                onClick={() => this.props.setBodyModalParamsAction('INFO_ACCOUNT', el.account)}
                                                                                            >
                                                                                                {el.accountRS}
                                                                                            </a>
                                                                                        </td>
                                                                                    </tr>
                                                                                );
                                                                            })
                                                                        }
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Minimum Balance Model:</td>
                                                        <td>{this.state.transaction.attachment.phasingMinBalanceModel === 0 && 'NONE'}</td>
                                                    </tr>

                                                    <tr>
                                                        <td>Full Hash:</td>
                                                        <td>{this.state.transaction.attachment.phasingWhitelist ? this.state.transaction.attachment.phasingWhitelist : '-'}</td>
                                                    </tr>

                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </TabContaier>
                                }

                            </TabulationBody>

                            <div className="btn-box align-buttons-inside absolute right-conner">
                                <a className="btn btn-right round round-top-left round-bottom-right"
                                   onClick={() => this.props.closeModal()}
                                >
                                    Close
                                </a>
                            </div>
                        </div>
                    </form>
                }

            </div>
        );
    }
}

const mapStateToProps = state => ({
    accountRS: state.account.accountRS,
    modalType: state.modals.modalType,
    modalData: state.modals.modalData,
    modalsHistory: state.modals.modalsHistory,
    constants: state.account.constants,
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    formatTimestamp: (timestamp) => dispatch(formatTimestamp(timestamp)),
    openPrevModal: () => dispatch(openPrevModal()),
    getTransaction: transaction => dispatch(getTransactionAction(transaction)),
    getAccountInfoAction: (account) => dispatch(getAccountInfoAction(account)),
});

export default connect(mapStateToProps, mapDispatchToProps)(InfoLedgerTransaction);
