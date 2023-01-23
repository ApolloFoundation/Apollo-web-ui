/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import axios from 'axios';
import queryString from 'query-string';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import { NotificationManager } from 'react-notifications';
import { login, setTicker } from '../../modules/account';
import { setBodyModalParamsAction } from '../../modules/modals';
import { getTransactionsAction } from '../transactions';
import { getAccountLedgerAction } from '../ledger';
import { getAliasesAction, getAccountCurrenciesAction } from '../currencies';
import { getSpecificAccountAssetsAction } from '../assets';
import { getTradesAction } from '../trade-history';
import { getDGSGoodsAction } from '../marketplace';
import { writeToLocalStorage, deleteFromLocalStorage } from '../localStorage';
import { makeLoginReq } from '../login';
import { processElGamalEncryption } from '../crypto';
import { handleFetch } from '../../helpers/fetch';
import utils from '../../helpers/util/utils';
import submitForm, { sendRequest } from '../../helpers/forms/forms';
import store from '../../store';
import config from '../../config';
import cancelAxiosRequest from '../../helpers/cancelToken';

export function getAccountInfoAction(currAccount) {
  return (dispatch, getStore) => axios.get(config.api.serverUrl, {
    params: {
      requestType: 'getAccount',
      includeAssets: true,
      includeCurrencies: true,
      includeLessors: true,
      includeEffectiveBalance: true,
      ...currAccount,
    },
    cancelToken: cancelAxiosRequest.token,
  })
    .then(res => {
      if (res.data && (!res.data.errorCode || res.data.errorCode === 5)) {
        delete res.data.errorCode;
        delete res.data.errorDescription;
        const { account } = getStore().account;
        if (account === res.data.account) {
          dispatch(login(res.data));
        }
        return res.data;
      }
    });
}

export function getAccountAction(reqParams) {
  return dispatch => ({
    TRANSACTIONS: dispatch(getTransactionsAction(reqParams)),
    ACCOUNT_LEDGER: dispatch(getAccountLedgerAction(reqParams)),
    ASSETS: dispatch(getSpecificAccountAssetsAction(reqParams)),
    TRADES: dispatch(getTradesAction(reqParams)),
    CURRENCIES: dispatch(getAccountCurrenciesAction(reqParams)),
    GOODS: dispatch(getDGSGoodsAction({ ...reqParams, seller: reqParams.account })),
    ALIASES: dispatch(getAliasesAction(reqParams)),
    ACCOUNT: dispatch(getAccountInfoAction(reqParams)),
  });
}

export function switchAccountAction(account, history) {
  return async dispatch => {
    await dispatch(makeLoginReq({ account }));
    if (history) history.push('/dashboard');

    // Closing current modal window
    writeToLocalStorage('APLUserRS', account);
    deleteFromLocalStorage('secretPhrase');
    dispatch(setBodyModalParamsAction());
  };
}

export function logOutAction() {
  return dispatch => {
    dispatch(writeToLocalStorage('APLUserRS', null));
    window.location.reload();
  };
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
    const data = reqParams;
    data.requestType = 'sendMoneyPrivate';
    if (data.passphrase) data.passphrase = await processElGamalEncryption(data.passphrase);
    else if (data.secretPhrase) data.secretPhrase = await processElGamalEncryption(data.secretPhrase);

    return axios.post(config.api.serverUrl + queryString.stringify(data))
      .then(res => {
        if (!res.data.errorCode) {
          return res.data;
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
}

export function validateTokenAction(reqParams) {
  return () => axios.get(config.api.serverUrl, {
    params: {
      requestType: 'decodeToken',
      ...reqParams,
    },
  })
    .then(res => {
      if (!res.data.errorCode) {
        return res.data;
      }
      NotificationManager.error(res.data.errorDescription, 'Error', 5000);
    })
    .catch(err => {
      console.log(err);
    });
}

export function getAccountPropertiesAction(reqParams) {
  return () => axios.get(config.api.serverUrl, {
    params: {
      requestType: 'getAccountProperties',
      ...reqParams,
    },
  })
    .then(res => res.data)
    .catch(err => {
      console.log(err);
    });
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
      .then(res => res.json())
      .catch(() => {

      });
  };
}

export const generateAccountAction = async requestParams => store.dispatch(await submitForm.submitForm(requestParams, 'generateAccount'));

export const enable2FAActon = async requestParams => store.dispatch(await submitForm.submitForm(requestParams, 'enable2FA'));

export const disable2FAActon = async requestParams => store.dispatch(await submitForm.submitForm(requestParams, 'disable2FA'));

export const confirm2FAActon = async requestParams => store.dispatch(await submitForm.submitForm(requestParams, 'confirm2FA'));

export const importAccountAction = async requestParams => store.dispatch(await submitForm.submitForm(requestParams, 'importKey'));

export const importAccountActionViaFile = (data) => store.dispatch(sendRequest('importKeyViaFile', data));

export const createAccountAction = async requestParams => store.dispatch(await submitForm.submitForm(requestParams, 'exportKey'));

export const removeAccountAction = async requestParams => store.dispatch(await submitForm.submitForm(requestParams, 'deleteKey'));

export const generatePDF = args => {
  const today = new Date();
  const dd = today.getDate();
  const mm = today.getMonth() + 1; // January is 0!
  const yyyy = today.getFullYear();

  if (window.cordova && window.pdf) {
    const options = {
      documentSize: 'A4',
      type: 'share',
      fileName: `apollo-wallet-${args[0].value}`,
    };

    let arrText = '';
    args.map(arg => {
      arrText += `<h3>${arg.name}:</h3>`;
      arrText += `<p>${arg.value}</p>`;
      QRCode.toDataURL(arg.value, (err, url) => {
        arrText += `<p><img src=${url} style="width: 100px" alt=""></p>`;
      });
    });
    
    window.pdf.fromData(`<html><h2>Apollo Paper Wallet</h2><p>${yyyy}/${mm}/${dd}</p>${arrText}</html>`, options)
      .then(stats => console.log('status', stats))
      .catch(err => console.err(err));
  } else if (utils.isDesktopApp() && window.java) {
    const data = JSON.stringify(args);
    let objJsonB64 = Buffer.from(data).toString("base64");
    window.java.downloadFile(objJsonB64, `apollo-wallet-${args[0].value}`);
  } else {
    const doc = new jsPDF();

    doc.setFontSize(15);
    doc.text('Apollo Paper Wallet', 15, 15);
    doc.setFontSize(10);
    doc.text(`${yyyy}/${mm}/${dd}`, 15, 24 + (6));

    args.map((arg, index) => {
      doc.text(`${arg.name}:`, 15, 24 + (6 * (2 + (10 * index))));
      doc.text(`${arg.value}`, 15, 24 + (6 * (3 + (10 * index))));

      QRCode.toDataURL(arg.value, (err, url) => {
        doc.addImage(url, 'SVG', 15, 24 + (6 * (4 + (10 * index))), 48, 48);
      });
    });

    doc.save(`apollo-wallet-${args[0].value}`);
  }
};
