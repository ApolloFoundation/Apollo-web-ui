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
import {getSpecificAccountAssetsAction} from '../../actions/assets';
import {getTradesAction} from '../../actions/trade-history';
import {getAccountCurrenciesAction} from '../../actions/currencies';
import {getDGSGoodsAction} from '../../actions/marketplace';

import {writeToLocalStorage} from "../localStorage";
import {NotificationManager} from "react-notifications";
import submitForm from '../../helpers/forms/forms'
import store from '../../store'
import {makeLoginReq} from "../login";
import {login, setShareMessage} from "../../modules/account";
import { setBodyModalParamsAction } from '../../modules/modals';

import QRCode from 'qrcode';

import jsPDF from 'jspdf';
import {processElGamalEncryption} from "../crypto";

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
    return (dispatch, getStore) => {
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
                    const {account} = getStore().account;
                    if (account === res.data.account) {
                        dispatch(login(res.data));
                    }
                    return res.data;
                }
            })
    }
}

export function switchAccountAction(account, history) {
    return async (dispatch) => {
        const newAccount = await makeLoginReq(dispatch, {account});
        console.log('----newAccount---', newAccount)
        if (history) history.push('/dashboard');

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
    return async () => {
        let data = reqParams;
        data.requestType = 'sendMoneyPrivate';
        if (data.passphrase) data.passphrase = await processElGamalEncryption(data.passphrase);
        else if (data.secretPhrase) data.secretPhrase = await processElGamalEncryption(data.secretPhrase);

        return axios.post(config.api.serverUrl + queryString.stringify(data))
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

export const getPhasingOnlyControl = (reqParams) => {
    return axios.get(config.api.serverUrl, {
        params: {
            requestType: 'getPhasingOnlyControl',
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

export function exportAccount(requestParams) {
    return async () => {
        let data = requestParams;
        if (data.passphrase) data.passphrase = await processElGamalEncryption(data.passphrase);
        else if (data.secretPhrase) data.secretPhrase = await processElGamalEncryption(data.secretPhrase);

        const body = Object.keys(data).map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
        }).join('&');
        return fetch(`${config.api.server}/rest/keyStore/download`, {
            method: 'POST',
            body,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        })
            .then(res => res.json())
            .catch(() => {

            })
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

export const importAccountActionViaFile = async (requestParams) => {
    return store.dispatch(await submitForm.submitForm(requestParams, 'importKeyViaFile'))
};

export const createAccountAction = async (requestParams) => {
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