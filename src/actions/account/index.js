import axios from 'axios';
import config from '../../config';
import queryString from 'query-string';

import {getTransactionsAction}   from '../../actions/transactions/';
import {getAccountLedgerAction}  from '../../actions/ledger/';
import {getAliasesAction}        from '../../actions/currencies/';
import {getAssetsAction, getSpecificAccountAssetsAction}         from '../../actions/assets';
import {getTradesAction}         from '../../actions/trade-history';
import {getAccountCurrenciesAction}  from '../../actions/currencies';
import {getDGSGoodsAction, getDGSPurchasesAction}       from '../../actions/marketplace';

import {writeToLocalStorage} from "../localStorage";
import {NotificationManager} from "react-notifications";

export function getAccountAction(reqParams) {
    return dispatch => {
        return {
            'TRANSACTIONS':   dispatch(getTransactionsAction(reqParams)),
            'ACCOUNT_LEDGER': dispatch(getAccountLedgerAction(reqParams)),
            'ASSETS':         dispatch(getSpecificAccountAssetsAction(reqParams)),
            'TRADES':         dispatch(getTradesAction(reqParams)),
            'CURRENCIES':     dispatch(getAccountCurrenciesAction(reqParams)),
            'GOODS':          dispatch(getDGSGoodsAction({seller: reqParams.account})),
            'ALIASES':        dispatch(getAliasesAction(reqParams)),
            'ACCOUNT':        dispatch(getAccountInfoAction(reqParams)),
        }
    }
}

export function getAccountInfoAction(account) {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getAccount',
                includeAssets: true,
                includeCurrencies: true,
                includeLessors: true,
                includeEffectiveBalance: true,
                ...account
            }
        })
            .then((res) => {
                if (!res.data.errorCode) {
                    return res.data
                }
            })
    }
}

export function switchAccountAction(account) {
    return dispatch => {
        writeToLocalStorage('APLUserRS', account);
        document.location.href = '/';
    }
}

export function logOutAction(account) {
    return dispatch => {
        dispatch(writeToLocalStorage('APLUserRS', null));
        window.location.reload();
    }
}

export function sendLeaseBalance(reqParams) {
    return (dispatch) => {
        reqParams = {
            requestType: 'sendMoneyPrivate',
            ...reqParams,
        };

        return axios.post(config.api.serverUrl + queryString.stringify(reqParams))
            .then((res) => {
                if (!res.data.errorCode) {
                    return res.data;
                }
                return;
            })
            .catch((err) => {
                console.log(err);
            })
    }
}

export function validateTokenAction(reqParams) {
    return (dispatch) => {
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'decodeToken',
                ...reqParams,
            }
        })
            .then((res) => {
                if (!res.data.errorCode) {
                    return res.data;
                } else {
                    NotificationManager.error(res.data.errorDescription, 'Error', 5000);
                    return;
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }
}

export function getNewsAction(reqParams) {
    return (dispatch) => {
        return axios.get(config.api.localServerUrl + '/api/twitter')
            .then((res) => {
                if (res.data.tweets) {
                    return res.data;
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }
}