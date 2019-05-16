/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {getPrivateTransactions, getTransactionAction} from '../../../actions/transactions/';
import {openPrevModal, setBodyModalParamsAction, setModalData} from '../../../modules/modals';
import Transaction from '../../account/transactions/transaction';
import {formatTimestamp} from "../../../helpers/util/time";
import crypto from "../../../helpers/crypto/crypto";
import {NotificationManager} from "react-notifications";
import {getBlockAction} from "../../../actions/blocks";

import CustomTable from '../../components/tables/table';
import TabulationBody from '../../components/tabulator/tabuator-body';
import TabContaier from '../../components/tabulator/tab-container';

class InfoBlock extends React.Component {
    state = {
        activeTab: 0,
        privateTransactions: null,
        secretPhrase: null,
        isShowPassphrase: false,
        blockInfo: null,
        modalData: null,
    };

    static getDerivedStateFromProps(props, state) {
        if (props.modalData && props.modalData !== state.modalData) {
            const isString = typeof modalData === 'string' || typeof modalData === 'number';

            if (isString) {
                this.getBlock({height: props.modalData});
                return {
                    modalData: props.modalData,
                }
            } else {
                if (props.modalData) {
                    return {
                        blockInfo: props.modalData,
                        modalData: props.modalData,
                    };
                }
            }
        }
        return null;
    };

    componentDidMount = () => {
        const {modalData} = this.props;
        this.checkBlock(modalData);
    };

    checkBlock = (modalData) => {
        const isString = typeof modalData === 'string' || typeof modalData === 'number';

        this.setState({modalData});

        if (isString) {
            this.getBlock({height: modalData})
        } else {
            if (modalData) {
                this.setState({
                    blockInfo: modalData
                });
            }
        }
    };

    getBlock = async (block) => {
        const blockInfo = await this.props.getBlockAction(block);
        this.setState({blockInfo});
    };

    handleTab(e, index) {
        e.preventDefault();

        this.setState({
            ...this.props,
            activeTab: index
        })
    }

    getTransaction = async (modalType, transactionId) => {
        const transaction = await this.props.getTransactionAction({
            transaction: transactionId
        });

        if (transaction) {
            this.props.setBodyModalParamsAction('INFO_TRANSACTION', transaction)
        }
    };

    showPrivateTransactions = async (secretPhrase) => {
        const isPassPhrease = await this.props.validatePassphrase(secretPhrase.secretPhrase);

        let data;

        if (isPassPhrease) {
            data = {secretPhrase: secretPhrase.secretPhrase};
        } else {
            data = {passphrase: secretPhrase.secretPhrase};
        }

        const requestParams = {
            ...secretPhrase,
            height: this.props.modalData.height,
            ...data
        };

        const privateTransactions = await getPrivateTransactions(requestParams);

        if (privateTransactions) {
            if (!privateTransactions.errorCode) {
                this.setState({
                    privateTransactions: privateTransactions.transactions
                })
            } else {
                NotificationManager.error(privateTransactions.errorDescription, 'Error', 5000)
            }
        }
    };

    handleSohwPassphrase = () => {
        this.setState({
            isShowPassphrase: !this.state.isShowPassphrase
        })
    };


    // TODO: migrate timesamp, migrate account to RS

    render() {
        const {blockInfo} = this.state;

        return (
            <div className="modal-box x-wide">
                {
                    this.props.modalData &&
                    <div className="modal-form">
                        <div className="form-group-app media-tab">
                            <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close"/></a>

                            <div className="form-title">
                                {this.props.modalsHistory.length > 1 &&
                                <div className={"backMy"} onClick={() => {
                                    this.props.openPrevModal()
                                }}/>
                                }
                                <p>Block {blockInfo.block} ({blockInfo.height}) info</p>
                            </div>

                            <TabulationBody>
                                <TabContaier sectionName="Transactions">
                                    <CustomTable
                                        header={[
                                            {
                                                name: 'Date',
                                                alignRight: false
                                            }, {
                                                name: 'Type',
                                                alignRight: false
                                            }, {
                                                name: 'Amount',
                                                alignRight: true
                                            }, {
                                                name: 'Fee',
                                                alignRight: true
                                            }, {
                                                name: 'Account',
                                                alignRight: false
                                            }, {
                                                name: 'Phasing',
                                                alignRight: true
                                            }, {
                                                name: 'Height',
                                                alignRight: true
                                            }, {
                                                name: 'Confirmations',
                                                alignRight: true
                                            }
                                        ]}
                                        className={'no-min-height transparent pt-4'}
                                        emptyMessage={'No active polls.'}
                                        TableRowComponent={Transaction}
                                        tableData={blockInfo.transactions}
                                    />
                                </TabContaier>
                                <TabContaier sectionName="Executed phased transactions">
                                    <p>No executed phased transactions in this block.</p>
                                </TabContaier>
                                <TabContaier sectionName="Block details">
                                    <div className="transaction-table no-min-height transparent">
                                        <div className="transaction-table-body transparent">
                                            <table>
                                                <tbody>
                                                <tr>
                                                    <td>Previous Block Hash:</td>
                                                    <td className="word-brake">{blockInfo.previousBlockHash}</td>
                                                </tr>
                                                <tr>
                                                    <td>Payload Length:</td>
                                                    <td className="word-brake">{blockInfo.payloadLength}</td>
                                                </tr>
                                                <tr>
                                                    <td>Total Fee ATM:</td>
                                                    <td className="word-brake">{blockInfo.totalFeeATM / 100000000}</td>
                                                </tr>
                                                <tr>
                                                    <td>Generation Signature:</td>
                                                    <td className="word-brake">{blockInfo.generationSignature}</td>
                                                </tr>
                                                <tr>
                                                    <td>Executed Phased Transactions:</td>
                                                    <td className="word-brake">{blockInfo.fullHash}</td>
                                                </tr>
                                                <tr>
                                                    <td>Generator Public Key:</td>
                                                    <td className="word-brake">{blockInfo.generatorPublicKey}</td>
                                                </tr>
                                                {/*<tr>*/}
                                                {/*<td>Full Hash:</td>*/}
                                                {/*<td>{this.props.modalData.fullHash}</td>*/}
                                                {/*</tr>*/}
                                                <tr>
                                                    <td>Base Target:</td>
                                                    <td className="word-brake">{blockInfo.baseTarget}</td>
                                                </tr>
                                                <tr>
                                                    <td>Payload Hash:</td>
                                                    <td className="word-brake">{blockInfo.payloadHash}</td>
                                                </tr>
                                                <tr>
                                                    <td>Number of Transactions:</td>
                                                    <td className="word-brake">{blockInfo.numberOfTransactions}</td>
                                                </tr>
                                                <tr>
                                                    <td>Block Signature:</td>
                                                    <td className="word-brake">{blockInfo.blockSignature}</td>
                                                </tr>
                                                <tr>
                                                    <td>Version:</td>
                                                    <td className="word-brake">{blockInfo.version}</td>
                                                </tr>
                                                <tr>
                                                    <td>Total Amount ATM:</td>
                                                    <td className="word-brake">{blockInfo.totalFeeATM / 100000000}</td>
                                                </tr>
                                                <tr>
                                                    <td>Cumulative Difficulty:</td>
                                                    <td className="word-brake">{blockInfo.cumulativeDifficulty}</td>
                                                </tr>
                                                <tr>
                                                    <td>Block:</td>
                                                    <td className="word-brake">{blockInfo.block}</td>
                                                </tr>
                                                <tr>
                                                    <td>Height:</td>
                                                    <td className="word-brake">{blockInfo.height}</td>
                                                </tr>
                                                <tr>
                                                    <td>Timestamp:</td>
                                                    <td className="word-brake">{blockInfo.timestamp}</td>
                                                </tr>
                                                <tr>
                                                    <td>Generator:</td>
                                                    <td className="word-brake">{blockInfo.generatorRS}</td>
                                                </tr>
                                                <tr>
                                                    <td>Previous Block:</td>
                                                    <td className="word-brake">{blockInfo.previousBlock}</td>
                                                </tr>
                                                <tr>
                                                    <td>Block Generating Time:</td>
                                                    <td>{this.props.formatTimestamp(blockInfo.timestamp)}</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </TabContaier>
                            </TabulationBody>

                            <div className="btn-box align-buttons-inside absolute right-conner">
                                <a className="btn btn-right round round-top-left round-bottom-right"
                                   onClick={() => this.props.closeModal()}
                                >
                                    Close
                                </a>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

const mapStateToProps = state => ({
    modalData: state.modals.modalData,
    modalsHistory: state.modals.modalsHistory,
});

const mapDispatchToProps = dispatch => ({
    getBlockAction: (requestParams) => dispatch(getBlockAction(requestParams)),

    validatePassphrase: (passphrase) => dispatch(crypto.validatePassphrase(passphrase)),
    setModalData: (data) => dispatch(setModalData(data)),
    getTransactionAction: (data) => dispatch(getTransactionAction(data)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    formatTimestamp: (timestamp) => dispatch(formatTimestamp(timestamp)),
    openPrevModal: (Params) => dispatch(openPrevModal(Params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(InfoBlock);
