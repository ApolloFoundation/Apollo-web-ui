/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import {connect} from 'react-redux';
import {getTransactionAction} from '../../../actions/transactions/';
import {setModalData, setBodyModalParamsAction} from '../../../modules/modals';
import Transaction from '../../account/transactions/transaction';
import classNames from 'classnames';
import uuid from "uuid";
import {formatTimestamp} from "../../../helpers/util/time";
import ModalFooter from '../../components/modal-footer'


class InfoBlock extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: 0
        };

        this.handleTab      = this.handleTab.bind(this);
        this.getTransaction = this.getTransaction.bind(this);
    }

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
    }


    // TODO: migrate timesamp, migrate account to RS

    render() {
        return (
            <div className="modal-box x-wide">
                {
                    this.props.modalData &&
                    <form className="modal-form">
                        <div className="form-group-app">
                            <a onClick={() => this.props.closeModal()} className="exit"><i className="zmdi zmdi-close" /></a>

                            <div className="form-title">
                                <p>Block {this.props.modalData.block} ({this.props.modalData.height})</p>
                            </div>

                            <div className="form-tabulator active">
                                <div className="form-tab-nav-box justify-left">
                                    <a onClick={(e) => this.handleTab(e, 0)} className={classNames({
                                        "form-tab": true,
                                        "active": this.state.activeTab === 0
                                    })}>
                                        <span className="pre">Transactions</span>
                                    </a>
                                    <a onClick={(e) => this.handleTab(e, 1)} className={classNames({
                                        "form-tab": true,
                                        "active": this.state.activeTab === 1
                                    })}>
                                        <span className="pre">Executed phased transactions</span>
                                    </a>
                                    <a onClick={(e) => this.handleTab(e, 2)} className={classNames({
                                        "form-tab": true,
                                        "active": this.state.activeTab === 2
                                    })}>
                                        <span className="pre">Block details</span>
                                    </a>

                                </div>

                                <div className={classNames({
                                    "tab-body": true,
                                    "active": this.state.activeTab === 0
                                })}>
                                    {
                                        this.props.modalData.transactions &&
                                        !this.props.modalData.transactions.length &&
                                        'No transactions in this block.'
                                    }
                                    {
                                        this.props.modalData.transactions &&
                                        !!this.props.modalData.transactions.length &&
                                        <div className="transaction-table no-min-height">
                                            <div className="transaction-table-body transparent padding-vertical-padding">

                                                <table>
                                                    <thead key={uuid()}>
                                                    <tr>
                                                        <td>Index</td>
                                                        <td>Date</td>
                                                        <td>Type</td>
                                                        <td className="align-right">Amount</td>
                                                        <td className="align-right">Fee</td>
                                                        <td>From</td>
                                                        <td>To</td>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        this.props.modalData.transactions &&
                                                        this.props.modalData.transactions.map((el, index) => {

                                                            return (
                                                                <Transaction
                                                                    key={uuid()}
                                                                    block
                                                                    transaction = {el}
                                                                    index={index}
                                                                    setTransactionInfo={this.getTransaction}
                                                                />
                                                            )
                                                        })
                                                    }

                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    }

                                </div>
                                <div className={classNames({
                                    "tab-body": true,
                                    "active": this.state.activeTab === 1
                                })}>
                                    <p>No executed phased transactions in this block.</p>
                                </div>
                                <div className={classNames({
                                    "tab-body": true,
                                    "active": this.state.activeTab === 2
                                })}>
                                    <div className="transaction-table no-min-height">
                                        <div className="transaction-table-body transparent">
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td>Previous Block Hash:</td>
                                                        <td className="word-brake">{this.props.modalData.previousBlockHash}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Payload Length:</td>
                                                        <td className="word-brake">{this.props.modalData.payloadLength}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Total Fee ATM:</td>
                                                        <td className="word-brake">{this.props.modalData.totalFeeATM / 100000000}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Generation Signature:</td>
                                                        <td className="word-brake">{this.props.modalData.generationSignature}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Executed Phased Transactions:</td>
                                                        <td className="word-brake">{this.props.modalData.fullHash}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Generator Public Key:</td>
                                                        <td className="word-brake">{this.props.modalData.generatorPublicKey}</td>
                                                    </tr>
                                                    {/*<tr>*/}
                                                        {/*<td>Full Hash:</td>*/}
                                                        {/*<td>{this.props.modalData.fullHash}</td>*/}
                                                    {/*</tr>*/}
                                                    <tr>
                                                        <td>Base Target:</td>
                                                        <td className="word-brake">{this.props.modalData.baseTarget}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Payload Hash:</td>
                                                        <td className="word-brake">{this.props.modalData.payloadHash}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Number of Transactions:</td>
                                                        <td className="word-brake">{this.props.modalData.numberOfTransactions}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Block Signature:</td>
                                                        <td className="word-brake">{this.props.modalData.blockSignature}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Version:</td>
                                                        <td className="word-brake">{this.props.modalData.version}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Total Amount ATM:</td>
                                                        <td className="word-brake">{this.props.modalData.totalFeeATM / 100000000}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Cumulative Difficulty:</td>
                                                        <td className="word-brake">{this.props.modalData.cumulativeDifficulty}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Block:</td>
                                                        <td className="word-brake">{this.props.modalData.block}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Height:</td>
                                                        <td className="word-brake">{this.props.modalData.height}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Timestamp:</td>
                                                        <td className="word-brake">{this.props.modalData.timestamp}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Generator:</td>
                                                        <td className="word-brake">{this.props.modalData.generatorRS}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Previous Block:</td>
                                                        <td className="word-brake">{this.props.modalData.previousBlock}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Block Generating Time:</td>
                                                        <td>{this.props.formatTimestamp(this.props.modalData.timestamp)}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
    modalData: state.modals.modalData
});

const mapDispatchToProps = dispatch => ({
    setModalData: (data) => dispatch(setModalData(data)),
    getTransactionAction: (data) => dispatch(getTransactionAction(data)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    formatTimestamp: (timestamp) => dispatch(formatTimestamp(timestamp)),
});

export default connect(mapStateToProps, mapDispatchToProps)(InfoBlock);
