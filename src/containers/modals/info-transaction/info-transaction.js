/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';
import {openPrevModal, setBodyModalParamsAction, setModalData} from '../../../modules/modals';
import {getTransactionAction} from "../../../actions/transactions";
import {formatTimestamp} from "../../../helpers/util/time";
import InfoTransactionTable from "./info-transoction-table"
import {getAccountInfoAction} from "../../../actions/account";
import TabulationBody from '../../components/tabulator/tabuator-body';
import TabContaier from '../../components/tabulator/tab-container';
import ModalBody from "../../components/modals/modal-body";
import ContentLoader from "../../components/content-loader";
import InfoBox from "../../components/info-box";
import {getCurrencyAction} from "../../../actions/currencies";


class InfoLedgerTransaction extends React.Component {
    state = {
        isPending: true,
        activeTab: 0,
        transaction: null,
        transactionId: null,
        currency: null,
    };

    handleTab = (e, index) => {
        e.preventDefault();

        this.setState({
            ...this.props,
            activeTab: index
        });
    }

    processTransaction = async () => {
        let currency = null;
        const transaction = await this.props.getTransactionAction({transaction: this.state.transactionId});
        if (transaction && transaction.attachment.currency) {
            currency = await this.props.getCurrencyAction({currency: transaction.attachment.currency});
        }
        this.setState({
            transaction,
            isPending: false,
            currency,
        });
    };

    static getDerivedStateFromProps(props, state) {
        if (props.modalData
            && Object.keys(props.modalData).length > 0
            && (!state.transactionId || props.modalData !== state.modalData)
            && props.modalType === 'INFO_TRANSACTION'
        ) {
            if (props.modalData && !props.modalData.errorCode) {
                const isDataObject = props.modalData instanceof Object;
                return {
                    modalData: props.modalData,
                    transaction: isDataObject ? props.modalData : null,
                    transactionId: isDataObject ? props.modalData.transaction : props.modalData,
                    isPending: !isDataObject,
                };
            }
        }
        return null;
    };

    getCurrency = async () => {
        let currency = null;
        if (this.state.transaction && this.state.transaction.attachment.currency) {
            currency = await this.props.getCurrencyAction({
                currency: this.state.transaction.attachment.currency
            });
        }
        this.setState({
            currency,
        });
    }

    componentDidMount() {
        if (this.state.transactionId && !(this.state.transaction instanceof Object)) {
            this.processTransaction();
        }
        this.getCurrency();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.transactionId && prevState.transactionId !== this.state.transactionId) {
            this.processTransaction();
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

    handleTransferCurrency = () => {
        const { transaction, currency } = this.state;
        const recipientRS = transaction
          && (this.props.accountRS === transaction.recipientRS ? transaction.senderRS : transaction.recipientRS);

        const data = {
            recipient: recipientRS,
            ...currency,
        }
        this.props.setBodyModalParamsAction('TRANSFER_CURRENCY', data);
    }

    render() {
        const {transaction, transactionId} = this.state;
        const { decimals } = this.props;

        const parsedSignatures = (transaction && transaction.signature) && (typeof transaction.signature === "string" ? [transaction.signature] : transaction.signature.signatures.map(i => i.signature));
        
        const recipientRS = transaction
        && (this.props.accountRS === transaction.recipientRS ? transaction.senderRS : transaction.recipientRS);

          return (
            <ModalBody
                modalTitle={`Transaction ${transactionId || ''} Info`}
                closeModal={this.props.closeModal}
                isDisableFormFooter
                isDisableSecretPhrase
                isWide
            >
                {!this.state.isPending ? (
                    transaction && this.props.constants.transactionTypes && this.props.constants.transactionTypes[transaction.type] ? (
                      <TabulationBody>
                        <TabContaier sectionName={'Info'}>
                          <div className="transaction-table no-min-height transparent">
                            <InfoTransactionTable transaction={transaction} constants={this.props.constants}/>
                          </div>
                        </TabContaier>

                            <TabContaier sectionName={'Actions'}>
                                {
                                    this.state.transaction &&
                                    <div className="flexible-grid">

                                        <button
                                            type={'button'}
                                            onClick={() => this.props.setBodyModalParamsAction('SEND_APOLLO', {recipient: recipientRS})}
                                            className={`btn btn-green ${!this.state.transaction.recipientRS ? 'disabled' : ''}`}
                                        >
                                            Send Apollo
                                        </button>
                                        <button
                                            type={'button'}
                                            onClick={() => this.props.setBodyModalParamsAction('COMPOSE_MESSAGE', {recipient: recipientRS})}
                                            className={`btn btn-green ${!this.state.transaction.recipientRS ? 'disabled' : ''}`}
                                        >
                                            Send a message
                                        </button>
                                        <button
                                            type={'button'}
                                            onClick={() => this.props.setBodyModalParamsAction('SAVE_ACCOUNT', recipientRS)}
                                            className={`btn btn-green ${!this.state.transaction.recipientRS ? 'disabled' : ''}`}
                                        >
                                            Add as contact
                                        </button>
                                        <button
                                            type={'button'}
                                            onClick={this.handleTransferCurrency}
                                            className={
                                                classNames('btn btn-green', {
                                                    'disabled': !this.state.transaction.recipientRS || !this.state.currency,
                                                    }
                                                )
                                            }
                                        >
                                            Transfer Currency
                                        </button>
                                    </div>
                                }
                            </TabContaier>

                            <TabContaier sectionName={'Transactions Details'}>
                                <div className="transaction-table no-min-height transparent">
                                    <div className="transaction-table-body transparent full-info">
                                        <table>
                                            <tbody>
                                            {(this.state.transaction && this.state.transaction.errorMessage) && (
                                                <tr>
                                                    <td>
                                                        Error message:
                                                    </td>
                                                    <td>
                                                        {this.state.transaction.errorMessage || 'some error message'}
                                                    </td>
                                                </tr>
                                            )}
                                            <tr>
                                                <td>

                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Sender public key:</td>
                                                <td>{this.state.transaction.senderPublicKey}</td>
                                            </tr>
                                            <tr>
                                              <td>Signature:</td>
                                              <td className={'no-white-space'}>
                                                {parsedSignatures &&
                                                  parsedSignatures.map(signature => (
                                                  <>
                                                    <span className={'break-word'}>{signature}</span>
                                                    <br /><br />
                                                  </>
                                                ))}
                                              </td>
                                            </tr>
                                            <tr>
                                                <td>Fee ATM:</td>
                                                <td>{this.state.transaction.feeATM / decimals}</td>
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
                                                <td className={'no-white-space'}>
                                                  <span className={'break-word'}>{this.state.transaction.signatureHash}</span>
                                                </td>
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
                                                                this.state.transaction.attachment.priceATM / decimals
                                                                :
                                                                this.state.transaction.amountATM / decimals
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
                                                            <div
                                                                className={'transaction-table-body transparent no-border-top'}>
                                                                <table>
                                                                    <thead>
                                                                    <tr>
                                                                        <td style={{
                                                                            padding: '20px 0 20px',
                                                                            border: 0
                                                                        }}>Account
                                                                        </td>
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
                    ) : (
                        <InfoBox default>
                            Transaction not found
                        </InfoBox>
                    )
                ) : (
                    <ContentLoader/>
                )}
            </ModalBody>
        );
    }
}

const mapStateToProps = state => ({
    accountRS: state.account.accountRS,
    decimals: state.account.decimals,
    modalType: state.modals.modalType,
    modalData: state.modals.modalData,
    modalsHistory: state.modals.modalsHistory,
    constants: state.account.constants,
});

const mapDispatchToProps = {
    setModalData,
    setBodyModalParamsAction,
    formatTimestamp,
    openPrevModal,
    getTransactionAction,
    getAccountInfoAction,
    getCurrencyAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(InfoLedgerTransaction);
