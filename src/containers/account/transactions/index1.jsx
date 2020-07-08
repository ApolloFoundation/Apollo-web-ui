/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useEffect, useCallback } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import SiteHeader from  '../../components/site-header'
import Transaction from './transaction'
import {getTransactionsAction, getTransactionAction, getPrivateTransactionAction} from "../../../actions/transactions";
import {setModalCallback, setBodyModalParamsAction, setModalType} from "../../../modules/modals";
import {BlockUpdater} from "../../block-subscriber/index";
import {NotificationManager} from "react-notifications";

import CustomTable from '../../components/tables/table';

export default function Transactions() {
  const dispatch = useDispatch();

  const { account } = useSelector(state => state.account);

  const [page, setPage] = useState(1);
  const [firstIndex, setFirstIndex] = useState(0);
  const [lastIndex, setLastIndex] = useState(15);
  const [type, setType] = useState(null);
  const [subtype, setSubtype] = useState(null);
  const [requestType, setRequestType] = useState(null);
  const [transactions, setTransactions] = useState(null);
  const [isUnconfirmed, setIsUnconfirmed] = useState(false);
  const [isAll, setIsAll] = useState(false);

  const updateTransactionsData  = useCallback(newState  => {
    // check
    this.setState({
        ...newState,

    }, () => {
        this.getPrivateTransactions({
            ...this.state.passphrase
        });
    });
  }, []);

  const getPrivateTransactions = useCallback(data => {
    let reqParams = {
        type: type,
        account: account,
        firstIndex: firstIndex,
        lastIndex: lastIndex,
        requestType: requestType,
    };

    if (data) {
        if (Object.values(data)[0]) {
            reqParams = {
                ...reqParams,
                ...data
            }
            this.setState({
                ...this.state,
                passphrase: data
            }, () => {
                this.getTransactions(reqParams);
            });
        }
        else {
            this.getTransactions(reqParams);
        }
    }
  }, []);

  const onPaginate = useCallback(page => {
    let reqParams = {
        type: type,
        account: account,
        page: page,
        firstIndex: page * 15 - 15,
        lastIndex: page * 15,
        requestType: requestType,
        ...this.state.passphrase
    };


    this.setState(reqParams, () => {
        this.getTransactions(reqParams, this.state.isAll)
    });
  }, []);

const getTransactions = useCallback(async (requestParams, all) => {
    let params = requestParams;
    delete params.requestType;

    if (!this.state.isUnconfirmed && !this.state.isPhassing) {
        const transactions = await this.props.getTransactionsAction(params);

        if (transactions) {
            if (!transactions.errorCode) {
                this.setState({
                    transactions: transactions.transactions,
                    isUnconfirmed: false,
                    isError: false,
                });
                if (transactions.serverPublicKey && !this.state.isPrivate) {
                    this.setState({
                        isPrivate: true
                    }, () => {
                        NotificationManager.success('You are watching private transactions.', null, 900000);
                    })
                }
            } else {
                if (!this.state.isError) {
                    this.setState({
                        isError: true
                    }, () => {
                        NotificationManager.error(transactions.errorDescription, 'Error', 900000);
                    })
                }
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
                transactions: transactions.transactions
            });
        }
    }
  }, []);

  const getUnconfirmedTransactionsTransactions  = useCallback(async (requestParams) => {
    let params = requestParams;
    if (this.state.isAll) {
        delete params.account;
    }
    const unconfirmedTransactions = await this.props.getTransactionsAction(params);

    if (unconfirmedTransactions) {
        if (this.state.isAll) {
            this.setState({
                isAll: true,
                isUnconfirmed: true,
                transactions: unconfirmedTransactions.unconfirmedTransactions,
            });
        } else {
            this.setState({
                isAll: false,
                isUnconfirmed: true,
                transactions: unconfirmedTransactions.unconfirmedTransactions
            });
        }
    }
  }, []);

  const getTransaction = useCallback(async (requestParams) => {
    const transaction = await this.props.getTransactionAction(requestParams);
    this.props.setBodyModalParamsAction('INFO_TRANSACTION', transaction)
  }, []);

  const setTransactionInfo = useCallback((modalType, data, isPrivate) => {
    if (isPrivate) {
        this.getTransaction({
            account: account,
            transaction: data,
            passphrase:   this.state.passphrase.passphrase || null ,
            secretPhrase: this.state.passphrase.secretPhrase || null
        });
    } else {
        this.getTransaction({
            account: account,
            transaction: data,
        });
    }
  }, []);

  const handleTransactionFilters = useCallback((type, subtype, requestType, all) => {
    if (requestType === 'getUnconfirmedTransactions') {
        if (all) {
            this.setState({
                isAll: true,
                isUnconfirmed: true,
                isPhassing: false
            }, () => {
                next();

            })
        } else {
            this.setState({
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
            isUnconfirmed: false,
            isPhassing: false
        }, () => {
            next();
        })
    }

    const next = () => {
        this.setState({
            type: type,
            subtype: subtype,
            page:       1,
            firstIndex: 0,
            lastIndex:  15,
            requestType: requestType,
            ...this.state.passphrase

        }, () => {
            this.getTransactions({
                type: this.state.type,
                account:    this.props.account,
                firstIndex: 0,
                lastIndex:  15,
                requestType: requestType,
                ...this.state.passphrase
            }, all);
        });
    }
  }, []);

  useEffect(() => {
    getTransactions({
      type: type,
      account: account,
      firstIndex: firstIndex,
      lastIndex: lastIndex,
      requestType: requestType
    });
    dispatch(setModalCallbackAction(this.getPrivateTransactions));
    BlockUpdater.on("data", data => {
        console.warn("height in dashboard", data);
        console.warn("updating dashboard");
        updateTransactionsData();
    });

    return BlockUpdater.removeAllListeners('data');
  }, []);

  useEffect(() => {
    updateTransactionsData(newState);
  }, [])
}
class Transactions extends React.Component {


    getUnconfirmedTransactionsTransactions  = async (requestParams) => {
        let params = requestParams;
        if (this.state.isAll) {
            delete params.account;
        }
        const unconfirmedTransactions = await this.props.getTransactionsAction(params);

        if (unconfirmedTransactions) {
            if (this.state.isAll) {
                this.setState({
                    isAll: true,
                    isUnconfirmed: true,
                    transactions: unconfirmedTransactions.unconfirmedTransactions,
                });
            } else {
                this.setState({
                    isAll: false,
                    isUnconfirmed: true,
                    transactions: unconfirmedTransactions.unconfirmedTransactions
                });
            }
        }
    };

    getTransaction = async (requestParams) => {
        const transaction = await this.props.getTransactionAction(requestParams);
        this.props.setBodyModalParamsAction('INFO_TRANSACTION', transaction)
    };

    setTransactionInfo(modalType, data, isPrivate) {

        if (isPrivate) {
            this.getTransaction({
                account: this.props.account,
                transaction: data,
                passphrase:   this.state.passphrase.passphrase || null ,
                secretPhrase: this.state.passphrase.secretPhrase || null
            });
        } else {
            this.getTransaction({
                account: this.props.account,
                transaction: data,
            });
        }
    }

    handleTransactionFilters = (type, subtype, requestType, all) => {
        if (requestType === 'getUnconfirmedTransactions') {
            if (all) {
                this.setState({
                    isAll: true,
                    isUnconfirmed: true,
                    isPhassing: false
                }, () => {
                    next();

                })
            } else {
                this.setState({
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
                isUnconfirmed: false,
                isPhassing: false
            }, () => {
                next();
            })
        }

        const next = () => {
            this.setState({
                type: type,
                subtype: subtype,
                page:       1,
                firstIndex: 0,
                lastIndex:  15,
                requestType: requestType,
                ...this.state.passphrase

            }, () => {
                this.getTransactions({
                    type: this.state.type,
                    account:    this.props.account,
                    firstIndex: 0,
                    lastIndex:  15,
                    requestType: requestType,
                    ...this.state.passphrase
                }, all);
            });
        }
    };

    AboveTabeComponentItem = (label, handler, activeCondition) => (
        <div
            className={classNames({
                "btn" : true,
                "filter" : true,
                "active": activeCondition
            })}
            onClick={() => this.handleTransactionFilters(handler, null)}
        >
            {label}
        </div>
    );

    AboveTabeComponent = () => (
        <div className="transactions-filters">
            <div className="top-bar">
                {this.AboveTabeComponentItem('All types', null, this.state.type !== 0 && !this.state.type && !this.state.subtype && !this.state.isPhassing && !this.state.isUnconfirmed)}

                {this.AboveTabeComponentItem(<i className="zmdi zmdi-card" />          , 0   , this.state.type === 0 && !this.state.subtype && !this.state.isPhassing)}
                {this.AboveTabeComponentItem(<i className="zmdi zmdi-email" />         , 1   , this.state.type === 1 && !this.state.subtype)}
                {this.AboveTabeComponentItem(<i className="zmdi zmdi-equalizer" />     , 2   , this.state.type === 2 && !this.state.subtype)}
                {this.AboveTabeComponentItem(<i className="zmdi zmdi-shopping-cart" /> , 3   , this.state.type === 3 && !this.state.subtype)}
                {this.AboveTabeComponentItem(<i className="zmdi zmdi-lock" />          , 4   , this.state.type === 4 && !this.state.subtype)}
                {this.AboveTabeComponentItem(<i className="zmdi zmdi-balance" />       , 5   , this.state.type === 5 && !this.state.subtype)}
                {this.AboveTabeComponentItem(<i className="zmdi zmdi-cloud" />         , 6   , this.state.type === 6 && !this.state.subtype)}
                {this.AboveTabeComponentItem(<i className="zmdi zmdi-shuffle" />       , 7   , this.state.type === 7 && !this.state.subtype)}
                {this.AboveTabeComponentItem(<i className="zmdi zmdi-help" />          , 8   , this.state.type === 8 && !this.state.subtype)}

                <div
                    className={classNames({
                        "btn" : true,
                        "filter" : true,
                        "active": this.state.isUnconfirmed && !this.state.isAll
                    })}
                    onClick={() => {
                        this.handleTransactionFilters(null, null, 'getUnconfirmedTransactions', false)
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
                    onClick={() => this.handleTransactionFilters(null, null, 'getAccountPhasedTransactions')}
                >
                    Phasing
                </div>
                <div
                    className={classNames({
                        "btn" : true,
                        "filter" : true,
                        "active": this.state.isUnconfirmed && this.state.isAll
                    })}
                    onClick={() => this.handleTransactionFilters(null, null, 'getUnconfirmedTransactions', true)}
                >
                    All Unconfirmed
                </div>

            </div>
        </div>
    );

    render () {

        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Transactions'}
                >
                    <button
                        type={'button'}
                        className={classNames({
                            'btn btn-green btn-sm': true,
                            'disabled' : this.state.isPrivate
                        })}
                        onClick={() => {
                            this.props.setModalType('PrivateTransactions')
                        }}
                    >
                        Show private transactions
                    </button>
                </SiteHeader>
                <div className="page-body container-fluid">
                    <div className={'my-transactions'}>
                        {this.AboveTabeComponent()}
                        <CustomTable
                            header={[
                                {
                                    name: 'Date',
                                    alignRight: false
                                },{
                                    name: 'Type',
                                    alignRight: false
                                },{
                                    name: 'Amount',
                                    alignRight: true
                                },{
                                    name: 'Fee',
                                    alignRight: true
                                },{
                                    name: 'Account',
                                    alignRight: false
                                },{
                                    name: 'Phasing',
                                    alignRight: true
                                },{
                                    name: 'Height',
                                    alignRight: true
                                },{
                                    name: 'Confirmations',
                                    alignRight: true
                                }
                            ]}
                            keyField={'ledgerId'}
                            className={'no-min-height mb-3'}
                            emptyMessage={'No transactions found.'}
                            TableRowComponent={Transaction}
                            passProps={{
                                secretPhrase: this.state.secretPhrase || this.state.passphrase,
                                isUnconfirmed: this.state.isUnconfirmed
                            }}
                            tableData={this.state.transactions}
                            isPaginate
                            page={this.state.page}
                            previousHendler={() => this.onPaginate(this.state.page - 1)}
                            nextHendler={() => this.onPaginate(this.state.page + 1)}
                            itemsPerPage={15}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    account: state.account.account,
    publicKey: state.account.publicKey,
    // modals
    modalData: state.modals.modalData,
    modalType: state.modals.modalType
});

const initMapDispatchToProps = dispatch => ({
    setModalType: (prevent) => dispatch(setModalType(prevent)),
    getTransactionsAction: (requestParams) => dispatch(getTransactionsAction(requestParams)),
    setModalCallbackAction: (callback) => dispatch(setModalCallback(callback)),
    getTransactionAction: (reqParams) => dispatch(getTransactionAction(reqParams)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
    getPrivateTransactionAction: (data) => dispatch(getPrivateTransactionAction(data)),

});

export default connect(
    mapStateToProps,
    initMapDispatchToProps
)(Transactions);
