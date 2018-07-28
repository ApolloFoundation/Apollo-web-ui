import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import uuid from 'uuid';
import SiteHeader from  '../../components/site-header'
import Transaction from './transaction'
import { getTransactionsAction, getTransactionAction } from "../../../actions/transactions";
import { setModalCallback, setBodyModalParamsAction } from "../../../modules/modals";
import curve25519 from "../../../helpers/crypto/curve25519";
import converters from "../../../helpers/converters";
import crypto from "../../../helpers/crypto/crypto";

class Transactions extends React.Component {
    constructor(props) {
        super(props);

        this.getTransactions = this.getTransactions.bind(this);
        this.getTransaction = this.getTransaction.bind(this);
        this.onPaginate  = this.onPaginate.bind(this);
        this.getPrivateTransactions = this.getPrivateTransactions.bind(this);
        this.setTransactionInfo = this.setTransactionInfo.bind(this);

        this.state = {
            page: 1,
            firstIndex: 0,
            lastIndex: 14,
            transactions: []
        };
    }

    componentDidMount() {
        this.getTransactions({
            account: this.props.account,
            firstIndex: this.state.firstIndex,
            lastIndex: this.state.lastIndex
        });
        this.props.setModalCallbackAction(this.getPrivateTransactions);
    }

    componentWillReceiveProps(newState) {
        this.setState({
            ...newState,
            publicKey:  this.state.publicKey,
            privateKey: this.state.privateKey,
            sharedKey:  this.state.sharedKey
        }, () => {
            this.getPrivateTransactions({
                PublicKey: this.state.publicKey
            });
        });
    }

    getPrivateTransactions = (data) => {
        let reqParams = {
            account:    this.props.account,
            firstIndex: this.state.firstIndex,
            lastIndex:  this.state.lastIndex
        };

        if (data && data.publicKey) {
            this.setState({
                ...this.props,
                publicKey:  data.publicKey,
                privateKey: data.privateKey
            });

            reqParams.publicKey = data.publicKey;
        }
        if (data && data.PublicKey) {
            reqParams.publicKey = data.PublicKey;
        }

        this.getTransactions(reqParams);
    };

    onPaginate (page) {
        let reqParams = {
            account:    this.props.account,
            page:       page,
            firstIndex: page * 15 - 15,
            lastIndex:  page * 15 - 1
        };

        if (this.state.publicKey) {
            reqParams.publicKey = this.state.publicKey
        }

        this.setState(reqParams, () => {
            this.getTransactions(reqParams)
        });
    }

    async getTransactions (requestParams){
        const transactions = await this.props.getTransactionsAction(requestParams);
        if (transactions) {
            if (transactions.serverPublicKey) {
                const privateKey = converters.hexStringToByteArray(this.state.privateKey);
                const sharedKey  = converters.byteArrayToHexString(new Uint8Array(crypto.getSharedSecretJava(
                    privateKey,
                    converters.hexStringToByteArray(transactions.serverPublicKey)
                )));

                this.setState({
                    ...this.props,
                    transactions: transactions.transactions,
                    serverPublicKey: transactions.serverPublicKey,
                    sharedKey : sharedKey
                });
            } else {
                this.setState({
                    ...this.props,
                    transactions: transactions.transactions
                });
            }
        }
    }

    async getTransaction (requestParams) {
        const transaction = await this.props.getTransactionAction(requestParams);

        if (transaction) {
            this.props.setBodyModalParamsAction('INFO_TRANSACTION', transaction)
        }
    }

    setTransactionInfo(modalType, data) {
        this.getTransaction({
            account: this.props.account,
            transaction: data
        });
    }


    render () {
        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Transactions'}
                    showPrivateTransactions={'transactions'}
                />
                <div className="page-body container-fluid">
                    <div className="my-transactions">
                        <div className="transactions-filters">
                            <div className="top-bar">
                                <div className="btn filter">All</div>
                            </div>
                            <div className="bottom-bar">
                                <div className="btn filter">All types</div>
                            </div>
                        </div>
                        <div className="transaction-table">
                            <div className="transaction-table-body">
                                <table>
                                    <thead key={uuid()}>
                                    <tr>
                                        <td>Date</td>
                                        <td>Type</td>
                                        <td className="align-right">Amount</td>
                                        <td className="align-right">Fee</td>
                                        <td>Account</td>
                                        <td className="align-right">Phasing</td>
                                        <td className="align-right">Height</td>
                                        <td className="align-right">Confirmations</td>
                                    </tr>
                                    </thead>
                                    <tbody key={uuid()}>
                                        {
                                            this.state.transactions &&
                                            this.state.transactions.map((el, index) => {

                                                return (
                                                    <Transaction
                                                        transaction = {el}
                                                        publicKey= {this.state.serverPublicKey}
                                                        privateKey={this.state.privateKey}
                                                        sharedKey= {this.state.sharedKey}
                                                        setTransactionInfo={this.setTransactionInfo}
                                                    />
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                                <div className="btn-box">
                                    <a
                                       className={classNames({
                                           'btn' : true,
                                           'btn-left' : true,
                                           'disabled' : this.state.page <= 1
                                       })}
                                       onClick={this.onPaginate.bind(this, this.state.page - 1)}
                                    > Previous</a>
                                    <div className='pagination-nav'>
                                        <span>{this.state.firstIndex + 1}</span>
                                        <span>&hellip;</span>
                                        <span>{this.state.lastIndex + 1}</span>
                                    </div>
                                    <a
                                       onClick={this.onPaginate.bind(this, this.state.page + 1)}
                                       className={classNames({
                                           'btn' : true,
                                           'btn-right' : true,
                                           'disabled' : this.state.transactions.length < 15
                                       })}
                                    >Next</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    account: state.account.account,

    // modals
    modalData: state.modals.modalData,
    modalType: state.modals.modalType
});

const initMapDispatchToProps = dispatch => ({
    getTransactionsAction: (requestParams) => dispatch(getTransactionsAction(requestParams)),
    setModalCallbackAction: (callback) => dispatch(setModalCallback(callback)),
    getTransactionAction: (reqParams) => dispatch(getTransactionAction(reqParams)),
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data))
});

export default connect(
    mapStateToProps,
    initMapDispatchToProps
)(Transactions);