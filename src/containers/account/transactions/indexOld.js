/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import {NotificationManager} from "react-notifications";
import SiteHeader from  '../../components/site-header'
import {getTransactionsAction } from "../../../actions/transactions";
import {setModalCallback, setModalType} from "../../../modules/modals";
import { getAccountSelector, getPassPhraseSelector } from '../../../selectors';
import { TableLoader } from '../../components/TableLoader';
import { TransactionFilter } from './TransactionFilter';
import Transaction from './transaction'
import {FailedType} from './failedType';

const Transactions = () => {
    const dispatch = useDispatch();
    const account = useSelector(getAccountSelector);
    const passPhrase = useSelector(getPassPhraseSelector);
    const [state, setState] = useState({
        type: null,
        subtype: null,
        isUnconfirmed: false,
        isAll: false,
        transactions: null,
        failedType: null,
    });

    const getPrivateTransactions = useCallback(() => {
        setState(prevState => ({
            ...prevState,
            isPrivate: true,
        }));
    }, []);

    const getTransactions = useCallback(async ({ firstIndex, lastIndex }) => {
        let params = {
            type: state.type,
            account,
            requestType: state.requestType,
            firstIndex,
            lastIndex,
        };
        
        if (state.failedType === FailedType.FAILED) {
            params.failedOnly = true;
        } else if (state.failedType === FailedType.NON_FAILED) {
            params.nonFailedOnly = true;
        }

        if (state.isPrivate) {
            params.secretPhrase = passPhrase;
        }
        
        if (!state.isUnconfirmed && !state.isPhassing) {
            const transactions = await dispatch(getTransactionsAction(params));

            if (transactions) {
                if (!transactions.errorCode) {
                    setState(prevState => ({
                        ...prevState, 
                        // transactions: transactions.transactions,
                        isUnconfirmed: false,
                    }));
                    if (transactions.serverPublicKey && !state.isPrivate) {
                        setState(prevState => ({
                            ...prevState,
                            isPrivate: true
                        }))
                        NotificationManager.success('You are watching private transactions.', null, 900000);
                    }
                    return transactions.transactions;
                } else {
                    NotificationManager.error(transactions.errorDescription, 'Error', 900000);
                    return [];
                }
            }
            return [];
        }
        if (state.isUnconfirmed) {
            params.requestType = state.requestType;
            return getUnconfirmedTransactionsTransactions(params, state.all)
        }
        if (state.isPhassing) {
            params.requestType = state.requestType;
            const transactions = await dispatch(getTransactionsAction(params));
            return transactions.transactions;
        }
        return [];
    }, [dispatch, state.requestType, state.isPrivate, state.type, state.isAll, state.isUnconfirmed, state.isPhassing, state.failedType])

    const getUnconfirmedTransactionsTransactions =  useCallback(async ({ account, ...params }) => {
        if (!state.isAll) {
            params.account = account;
        }

        const unconfirmedTransactions = await dispatch(getTransactionsAction(params));

        if (unconfirmedTransactions) {
            setState(prevState => ({
                ...prevState,
                isUnconfirmed: true,
                transactions: unconfirmedTransactions.unconfirmedTransactions,
            }));
            return unconfirmedTransactions.unconfirmedTransactions
        }
        return [];
    }, [dispatch, state.isAll]);

    const handleTransactionFilters = (type, subtype, requestType, all) => {
        if (requestType === 'getUnconfirmedTransactions') {
            if (all) {
                setState(prevState => ({
                    ...prevState,
                    isAll: true,
                    isUnconfirmed: true,
                    isPhassing: false,
                    failedType: null,
                }));
            } else {
                setState(prevState => ({
                    ...prevState,
                    isAll: false,
                    isUnconfirmed: true,
                    isPhassing: false,
                    failedType: null,
                }));
            }
        } else if (requestType === 'getAccountPhasedTransactions') {
            setState(prevState => ({
                ...prevState,
                isPhassing: true,
                isUnconfirmed: false,
                type: null,
                subtype: null
            }));
        } else {
            setState(prevState => ({
                ...prevState,
                isUnconfirmed: false,
                isPhassing: false
            }));
        }

        setState(prevState => ({
            ...prevState,
            failedType: null,
            type,
            subtype,
            requestType,
            isResetPagination: true,
        }));
    };

    const handleFailedTransactions = (failedOnly) => {
        setState(prevState => ({
            ...prevState, 
            type: null,
            failedType: failedOnly ? FailedType.FAILED : FailedType.NON_FAILED,
            isUnconfirmed: false,
            isPhassing: false,
            isAll: false,
            isResetPagination: true,
        }));
    }

    const handleResetPagination = useCallback(() => {
        setState(prevState => ({
            ...prevState,
            isResetPagination: false,
        }));
    }, []);

    useEffect(() => {
        dispatch(setModalCallback(getPrivateTransactions));
    }, [dispatch, getPrivateTransactions]);

        return (
            <div className="page-content">
                <SiteHeader pageTitle='Transactions'>
                    <button
                        type='button'
                        className={classNames({
                            'btn btn-green btn-sm': true,
                            'disabled' : state.isPrivate
                        })}
                        onClick={() => dispatch(setModalType('PrivateTransactions'))}
                    >
                        Show private transactions
                    </button>
                </SiteHeader>
                <div className="page-body container-fluid">
                    <div className={'my-transactions'}>
                        <TransactionFilter
                          handleTransactionFilters={handleTransactionFilters}
                          handleFailedTransactions={handleFailedTransactions}
                          failedType={state.failedType}
                          type={state.type}
                          subtype={state.subtype}
                          isPhassing={state.isPhassing}
                          isUnconfirmed={state.isUnconfirmed}
                          isAll={state.isAll}
                        />
                        <TableLoader
                            headersList={[
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
                            // keyField={'ledgerId'}
                            className={'no-min-height mb-3'}
                            emptyMessage={'No transactions found.'}
                            TableRowComponent={Transaction}
                            passProps={{
                                secretPhrase: state.secretPhrase || state.passphrase,
                                isUnconfirmed: state.isUnconfirmed
                            }}
                            dataLoaderCallback={getTransactions}
                            isResetPagination={state.isResetPagination}
                            onResetPagination={handleResetPagination}
                        />
                    </div>
                </div>
            </div>
        );
}

export default Transactions;
