/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import axios from 'axios';
import config from '../../config';
import queryString from 'query-string';

import {getTransactionsAction} from '../../actions/transactions/';
import {getAccountLedgerAction} from '../../actions/ledger/';
import {getAliasesAction} from '../../actions/currencies/';
import {getAssetsAction, getSpecificAccountAssetsAction} from '../../actions/assets';
import {getTradesAction} from '../../actions/trade-history';
import {getAccountCurrenciesAction} from '../../actions/currencies';
import {getDGSGoodsAction, getDGSPurchasesAction} from '../../actions/marketplace';

import {writeToLocalStorage} from "../localStorage";
import {NotificationManager} from "react-notifications";
import submitForm from '../../helpers/forms/forms'
import store from '../../store'
import {makeLoginReq} from "../login";
import {setShareMessage} from "../../modules/account";
import { setBodyModalParamsAction } from '../../modules/modals';

import QRCode from 'qrcode';

import jsPDF from 'jspdf';

export function getAccountAction(reqParams) {
    return dispatch => {
        return {
            'TRANSACTIONS': dispatch(getTransactionsAction(reqParams)),
            'ACCOUNT_LEDGER': dispatch(getAccountLedgerAction(reqParams)),
            'ASSETS': dispatch(getSpecificAccountAssetsAction(reqParams)),
            'TRADES': dispatch(getTradesAction(reqParams)),
            'CURRENCIES': dispatch(getAccountCurrenciesAction(reqParams)),
            'GOODS': dispatch(getDGSGoodsAction({seller: reqParams.account})),
            'ALIASES': dispatch(getAliasesAction(reqParams)),
            'ACCOUNT': dispatch(getAccountInfoAction(reqParams)),
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
                if (res.data || (res.data && res.data.errorCode === 5)) {
                    return res.data
                }
            })
    }
}

export function switchAccountAction(account, history) {
    return dispatch => {
        makeLoginReq(dispatch, {account})
        if (history) history.push('/dashboard')

        // Closing current modal window
        dispatch(setBodyModalParamsAction())
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
        return axios.get(config.api.localServerUrl)
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

export function getAccountPropertiesAction(reqParams) {
    return (dispatch) => {
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getAccountProperties',
                ...reqParams,
            }
        })
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                console.log(err);
            })
    }
}

export function loginWithShareMessage(account, transaction) {
    return dispatch => {
        dispatch(setShareMessage({isShareMessage: true, shareMessageTransaction: transaction}));
        makeLoginReq(dispatch, {account})
        dispatch(setBodyModalParamsAction('INFO_TRANSACTION', transaction))
    }
}

export const generateAccountAction = async (requestParams) => {
    return store.dispatch(await submitForm.submitForm(requestParams, 'generateAccount'))
};

export const enable2FAActon = async (requestParams) => {
    return store.dispatch(await submitForm.submitForm(requestParams, 'enable2FA'))
};

export const disable2FAActon = async (requestParams) => {
    return store.dispatch(await submitForm.submitForm(requestParams, 'disable2FA'))
};

export const confirm2FAActon = async (requestParams) => {
    return store.dispatch(await submitForm.submitForm(requestParams, 'confirm2FA'))
};

export const importAccountAction = async (requestParams) => {
    return store.dispatch(await submitForm.submitForm(requestParams, 'importKey'))
};

export const exportAccountAction = async (requestParams) => {
    return store.dispatch(await submitForm.submitForm(requestParams, 'exportKey'))
};

export const removeAccountAction = async (requestParams) => {
    return store.dispatch(await submitForm.submitForm(requestParams, 'deleteKey'))
}


export const generatePDF = (args) => {
    // e.preventDefault();

    let doc = new jsPDF({
        // orientation: 'landscape',
        unit: 'in',
        // format: [4, 2]  // tinggi, lebar
        format: [116,9, 82,7]
    });

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();


    doc.setFontSize(15);
    doc.text('Apollo Paper Wallet', 0.5, 0.5);
    doc.setFontSize(10);
    doc.text(`${yyyy}/${mm}/${dd}`, 0.5, 0.8 + (0.3))

    args.map((arg, index) => {
        doc.text(`${arg.name}:`, 0.5, 0.8 + (0.3 * (2 + (1 * 10 * index))))
        doc.text(`${arg.value}`, 0.5, 0.8 + (0.3 * (3 + (1 * 10 * index))))

        QRCode.toDataURL(arg.value, function (err, url) {
            doc.addImage( url, 'SVG', 0.5, 1.9 + (3 * index), 1.9, 1.9)
        })
    })

    doc.save(`apollo-wallet-${args[0].value}`)
}