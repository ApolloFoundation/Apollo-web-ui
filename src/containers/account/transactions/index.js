import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import uuid from 'uuid';
import SiteHeader from  '../../components/site-header'
import Transaction from './transaction'
import {getTransactionsAction, getTransactionAction, getPrivateTransactionAction} from "../../../actions/transactions";
import { setModalCallback, setBodyModalParamsAction } from "../../../modules/modals";
import curve25519 from "../../../helpers/crypto/curve25519";
import converters from "../../../helpers/converters";
import crypto from "../../../helpers/crypto/crypto";
import InfoBox from "../../components/info-box";
import {BlockUpdater} from "../../block-subscriber/index";


class Transactions extends React.Component {
    constructor(props) {
        super(props);

        this.getTransactions = this.getTransactions.bind(this);
        this.getPrivateTransactions = this.getPrivateTransactions.bind(this);
        this.setTransactionInfo = this.setTransactionInfo.bind(this);

        this.state = {
            page: 1,
            firstIndex: 0,
            lastIndex: 14,
            type: null,
            subtype: null,
            isUnconfirmed: false,
            isAll: false,
            transactions: null
        };
    }

    componentDidMount() {
        this.getTransactions({
            type: this.state.type,
            account: this.props.account,
            firstIndex: this.state.firstIndex,
            lastIndex: this.state.lastIndex,
            requestType: this.state.requestType

        });
        this.props.setModalCallbackAction(this.getPrivateTransactions);
        BlockUpdater.on("data", data => {
            console.warn("height in dashboard", data);
            console.warn("updating dashboard");
            this.updateTransactionsData();
        });
    }

    componentWillUnmount() {
        BlockUpdater.removeAllListeners('data');
    }

    updateTransactionsData  = (newState)  => {
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
    };

    componentWillReceiveProps(newState) {
        this.updateTransactionsData(newState);
        // this.setState({
        //     ...newState,
        //     publicKey:  this.state.publicKey,
        //     privateKey: this.state.privateKey,
        //     sharedKey:  this.state.sharedKey
        // }, () => {
        //     this.getPrivateTransactions({
        //         PublicKey: this.state.publicKey
        //     });
        // });
    }

    getPrivateTransactions = (data) => {
        let reqParams = {
            type: this.state.type,
            account:    this.props.account,
            firstIndex: this.state.firstIndex,
            lastIndex:  this.state.lastIndex,
            requestType: this.state.requestType

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

    onPaginate = (page) => {
        let reqParams = {
            type: this.state.type,
            account:    this.props.account,
            page:       page,
            firstIndex: page * 15 - 15,
            lastIndex:  page * 15 - 1,
            requestType: this.state.requestType
        };

        if (this.state.publicKey) {
            reqParams.publicKey = this.state.publicKey
        }

        this.setState(reqParams, () => {
            this.getTransactions(reqParams, this.state.isUnconfirmed, this.state.isAll)
        });
    };

    async getTransactions (requestParams, all){
        let params = requestParams;
        delete params.requestType;

        if (!this.state.isUnconfirmed && !this.state.isPhassing) {
            const transactions = await this.props.getTransactionsAction(params);

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
                        sharedKey : sharedKey,
                        isUnconfirmed: false
                    });
                } else {
                    this.setState({
                        ...this.props,
                        transactions: transactions.transactions,
                        isUnconfirmed: false
                    });
                }
            }
        }
        if (this.state.isUnconfirmed) {
            params.requestType = this.state.requestType;
            this.getUnconfirmedTransactionsTransactions(params, all)
        }
        if (this.state.isPhassing) {
            params.requestType = this.state.requestType;

            const transactions = await this.props.getTransactionsAction(params);

            if (transactions) {
                this.setState({
                    ...this.props,
                    transactions: transactions.transactions
                });
            }
        }
    }

    getUnconfirmedTransactionsTransactions  = async (requestParams) => {
        var params = requestParams;
        if (this.state.isAll) {
            delete params.account;
        }
        const unconfirmedTransactions = await this.props.getTransactionsAction(params);

        if (unconfirmedTransactions) {
            if (this.state.isAll) {
                this.setState({
                    ...this.props,
                    isAll: true,
                    isUnconfirmed: true,
                    transactions: unconfirmedTransactions.unconfirmedTransactions,
                });
            } else {
                this.setState({
                    ...this.props,
                    isAll: false,
                    isUnconfirmed: true,
                    transactions: unconfirmedTransactions.unconfirmedTransactions
                });
            }
        }
    };

    getTransaction = async (requestParams) => {
        const transaction = await this.props.getTransactionAction(requestParams);

        if (transaction) {
            this.props.setBodyModalParamsAction('INFO_TRANSACTION', transaction)
        } else {
            const privateTransaction = await this.props.getPrivateTransactionAction({...requestParams, publicKey: this.state.publicKey});

            if (privateTransaction){
                this.props.setBodyModalParamsAction('INFO_TRANSACTION', {privateTransaction, publicKey: this.state.publicKey,  privateKey: this.state.privateKey})
            }
        }
    };

    setTransactionInfo(modalType, data) {
        this.getTransaction({
            account: this.props.account,
            transaction: data
        });
    }

    handleTransactinonFilters = (type, subtype, requestType, all) => {
        if (requestType === 'getUnconfirmedTransactions') {
            if (all) {
                this.setState({
                    ...this.state,
                    isAll: true,
                    isUnconfirmed: true,
                    isPhassing: false
                }, () => {
                    next();

                })
            } else {
                this.setState({
                    ...this.state,
                    isAll: false,
                    isUnconfirmed: true,
                    isPhassing: false
                }, () => {
                    next();

                })
            }

        }
        else if (requestType === 'getAccountPhasedTransactions') {
            this.setState({
                ...this.state,
                isPhassing: true,
                isUnconfirmed: false,
                type: null,
                subtype: null
            }, () => {
                next();

            })
        }
        else {
            this.setState({
                ...this.state,
                isUnconfirmed: false,
                isPhassing: false
            }, () => {
                next();
            })
        }

        const next = () => {
            this.setState({
                ...this.state,
                type: type,
                subtype: subtype,
                page:       1,
                firstIndex: 0,
                lastIndex:  14,
                requestType: requestType
            }, () => {
                this.getTransactions({
                    type: this.state.type,
                    account:    this.props.account,
                    firstIndex: 0,
                    lastIndex:  14,
                    requestType: requestType
                }, requestType, all);
            });
        }
    };

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
                                <div
                                    className={classNames({
                                        "btn" : true,
                                        "filter" : true,
                                        "active": this.state.type !== 0 && !this.state.type && !this.state.subtype && !this.state.isPhassing && !this.state.isUnconfirmed
                                    })}
                                    onClick={() => this.handleTransactinonFilters(null, null)}
                                >All</div>
                                <div
                                    className={classNames({
                                        "btn" : true,
                                        "icon-button" : true,
                                        "filters" : true,
                                        "transparent" : true,
                                        "active": this.state.type === 0 && !this.state.subtype && !this.state.isPhassing
                                    })}
                                    onClick={() => this.handleTransactinonFilters(0, null)}
                                >
                                    <i className="zmdi zmdi-card" />
                                </div>
                                <div
                                    className={classNames({
                                        "btn" : true,
                                        "icon-button" : true,
                                        "filters" : true,
                                        "transparent" : true,
                                        "active": this.state.type === 1 && !this.state.subtype
                                    })}
                                    onClick={() => this.handleTransactinonFilters(1, null)}
                                >
                                    <i className="zmdi zmdi-email" />
                                </div>
                                <div
                                    className={classNames({
                                        "btn" : true,
                                        "icon-button" : true,
                                        "filters" : true,
                                        "transparent" : true,
                                        "active": this.state.type === 2 && !this.state.subtype
                                    })}
                                    onClick={() => this.handleTransactinonFilters(2, null)}
                                >
                                    <i className="zmdi zmdi-equalizer" />
                                </div>
                                <div
                                    className={classNames({
                                        "btn" : true,
                                        "icon-button" : true,
                                        "filters" : true,
                                        "transparent" : true,
                                        "active": this.state.type === 3 && !this.state.subtype
                                    })}
                                    onClick={() => this.handleTransactinonFilters(3, null)}
                                >
                                    <i className="zmdi zmdi-shopping-cart" />
                                </div>
                                <div
                                    className={classNames({
                                        "btn" : true,
                                        "icon-button" : true,
                                        "filters" : true,
                                        "transparent" : true,
                                        "active": this.state.type === 4 && !this.state.subtype
                                    })}
                                    onClick={() => this.handleTransactinonFilters(4, null)}
                                >
                                    <i className="zmdi zmdi-lock" />
                                </div>
                                <div
                                    className={classNames({
                                        "btn" : true,
                                        "icon-button" : true,
                                        "filters" : true,
                                        "transparent" : true,
                                        "active": this.state.type === 5 && !this.state.subtype
                                    })}
                                    onClick={() => this.handleTransactinonFilters(5, null)}
                                >
                                    <i className="zmdi zmdi-balance" />
                                </div>
                                <div
                                    className={classNames({
                                        "btn" : true,
                                        "icon-button" : true,
                                        "filters" : true,
                                        "transparent" : true,
                                        "active": this.state.type === 6 && !this.state.subtype
                                    })}
                                    onClick={() => this.handleTransactinonFilters(6, null)}
                                >
                                    <i className="zmdi zmdi-cloud" />
                                </div>
                                <div
                                    className={classNames({
                                        "btn" : true,
                                        "icon-button" : true,
                                        "filters" : true,
                                        "transparent" : true,
                                        "active": this.state.type === 7 && !this.state.subtype
                                    })}
                                    onClick={() => this.handleTransactinonFilters(7, null)}
                                >
                                    <i className="zmdi zmdi zmdi-shuffle" />
                                </div>
                                <div
                                    className={classNames({
                                        "btn" : true,
                                        "icon-button" : true,
                                        "filters" : true,
                                        "transparent" : true,
                                        "active": this.state.type === 8 && !this.state.subtype
                                    })}
                                    onClick={() => this.handleTransactinonFilters(8, null)}
                                >
                                    <i className="zmdi zmdi-help" />
                                </div>
                                <div
                                    className={classNames({
                                        "btn" : true,
                                        "filter" : true,
                                        "active": this.state.isUnconfirmed && !this.state.isAll
                                    })}
                                    onClick={() => {
                                        this.handleTransactinonFilters(null, null, 'getUnconfirmedTransactions', false)
                                    }}
                                >
                                    Unconfirmed (account)
                                </div>
                                <div
                                    className={classNames({
                                        "btn" : true,
                                        "filter" : true,
                                        "active": this.state.isPhassing
                                    })}
                                    onClick={() => this.handleTransactinonFilters(null, null, 'getAccountPhasedTransactions')}
                                >
                                    Phasing
                                </div>
                                <div
                                    className={classNames({
                                        "btn" : true,
                                        "filter" : true,
                                        "active": this.state.isUnconfirmed && this.state.isAll
                                    })}
                                    onClick={() => this.handleTransactinonFilters(null, null, 'getUnconfirmedTransactions', true)}
                                >
                                    All Unconfirmed
                                </div>

                            </div>
                            <div className="bottom-bar">
                                <div
                                    className={classNames({
                                        "btn" : true,
                                        "filter" : true,
                                        "active": this.state.type !== 0 && !this.state.type && !this.state.subtype && !this.state.isUnconfirmed && !this.state.isPhassing
                                    })}
                                    onClick={() => this.handleTransactinonFilters(null, null)}
                                >
                                    All types
                                </div>
                            </div>
                        </div>
                        <div className="transaction-table">
                            {
                                this.state.transactions &&
                                !!this.state.transactions.length &&
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
                                                        key={uuid()}
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
                                    {
                                        this.state.transactions &&
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
                                    }
                                </div>

                            }
                            {
                                this.state.transactions &&
                                !(!!this.state.transactions.length) &&
                                <InfoBox default>
                                    No transactions found.
                                </InfoBox>
                            }
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
    setBodyModalParamsAction: (type, data) => dispatch(setBodyModalParamsAction(type, data)),
    getPrivateTransactionAction: (data) => dispatch(getPrivateTransactionAction(data)),

});

export default connect(
    mapStateToProps,
    initMapDispatchToProps
)(Transactions);