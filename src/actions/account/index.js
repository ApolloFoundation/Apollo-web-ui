/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import axios from 'axios';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import queryString from 'query-string';

import config from '../../config';
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
import {login, setShareMessage,  setTicker} from "../../modules/account";
import { setBodyModalParamsAction } from '../../modules/modals';
import { handleFetch } from '../../helpers/fetch';
import {processElGamalEncryption} from "../crypto";
import utils from '../../helpers/util/utils';

export function getAccountAction(reqParams) {
    return dispatch => {
        return {
            'TRANSACTIONS': dispatch(getTransactionsAction(reqParams)),
            'ACCOUNT_LEDGER': dispatch(getAccountLedgerAction(reqParams)),
            'ASSETS': dispatch(getSpecificAccountAssetsAction(reqParams)),
            'TRADES': dispatch(getTradesAction(reqParams)),
            'CURRENCIES': dispatch(getAccountCurrenciesAction(reqParams)),
            'GOODS': dispatch(getDGSGoodsAction({...reqParams, seller: reqParams.account})),
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
                if (res.data && (!res.data.errorCode || res.data.errorCode === 5)) {
                    delete res.data.errorCode;
                    delete res.data.errorDescription;
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
        await dispatch(makeLoginReq({account}));
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

export function getCurrentTicker() {
    return async dispatch => {
        return handleFetch(`${config.api.server}/rest/v2/info/blockchain`, 'GET')
        .then(res => {
            if (res) {
            dispatch(setTicker({ticker: utils.normalizeTicker(res.ticker), decimals: 10 ** res.decimals}));
            }
        })
        .catch(err => {
            console.log(err);
        });
    };
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

export const getPhasingOnlyControl = reqParams => axios.get(config.api.serverUrl, {
  params: {
    requestType: 'getPhasingOnlyControl',
    ...reqParams,
  },
})
  .then(res => res.data)
  .catch(err => {
    console.log(err);
  });

export function exportAccount(requestParams) {
  return async () => {
    const data = requestParams;
    if (data.passPhrase) data.passPhrase = await processElGamalEncryption(data.passPhrase);
    else if (data.secretPhrase) data.secretPhrase = await processElGamalEncryption(data.secretPhrase);

    const body = Object.keys(data)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
      .join('&');
    return fetch(`${config.api.server}/rest/keyStore/download`, {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    })
        .then((res) => {
            return res.json();
        })
        .catch((err) => {
            console.log(err);
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
};


export const generatePDF = (args) => {
    const today = new Date();
    const dd = today.getDate();
    const mm = today.getMonth()+1; //January is 0!
    const yyyy = today.getFullYear();

    if (window.cordova && window.pdf) {
        let options = {
            documentSize: 'A4',
            type: 'share',
            fileName: `apollo-wallet-${args[0].value}`
        };

        let arrText = '';
        args.map((arg) => {
            arrText += `<h3>${arg.name}:</h3>`;
            arrText += `<p>${arg.value}</p>`;
            QRCode.toDataURL(arg.value, function (err, url) {
                arrText += `<p><img src=${url} style="width: 100px" alt=""></p>`;
            })
        });

        window.pdf.fromData(`<html><h2>Apollo Paper Wallet</h2><p>${yyyy}/${mm}/${dd}</p>${arrText}</html>`, options)
            .then((stats) => console.log('status', stats))
            .catch((err) => console.err(err))
    } else {
        let doc = new jsPDF();

        doc.setFontSize(15);
        doc.text('Apollo Paper Wallet', 15, 15);
        doc.setFontSize(10);
        doc.text(`${yyyy}/${mm}/${dd}`, 15, 24 + (6));

        args.map((arg, index) => {
            doc.text(`${arg.name}:`, 15, 24 + (6 * (2 + (10 * index))));
            doc.text(`${arg.value}`, 15, 24 + (6 * (3 + (10 * index))));

            QRCode.toDataURL(arg.value, function (err, url) {
                doc.addImage( url, 'SVG', 15, 24 + (6 * (4 + (10 * index))), 48, 48);
            })
        });

        doc.save(`apollo-wallet-${args[0].value}`)
    }
};
