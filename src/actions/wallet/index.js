/******************************************************************************
 * Copyright © 2019 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

import axios from 'axios/index';
import config from '../../config';
import {writeToLocalStorage} from "../localStorage";
import {setWallets} from "../../modules/account";

export function getWallets(requestParams) {
    return dispatch => {
        const body = Object.keys(requestParams).map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(requestParams[key]);
        }).join('&');
        return fetch(`${config.api.server}/rest/keyStore/accountInfo`, {
            method: 'POST',
            body,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
        })
            .then(res => res.json())
            .then(async (res) => {
                if (!res.errorCode) {
                    dispatch(setWallets(res));
                    writeToLocalStorage('wallets', JSON.stringify(res));
                    return res;
                }
            })
            .catch(() => {

            })
    }
}

export function getCurrencyBalance(requestParams) {
    return dispatch => {
        return axios.get(`${config.api.server}/rest/dex/balance?`, {
            params: requestParams
        })
            .then((res) => {
                if (!res.data.errorCode) {
                    return res.data
                }
            })
            .catch(() => {

            })
    }
}

export function walletWidthraw(requestParams) {
    return dispatch => {
        const body = Object.keys(requestParams).map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(requestParams[key]);
        }).join('&');
        return fetch(`${config.api.server}/dex/widthraw`, {
            method: 'POST',
            body,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
        })
            .then(res => res.json())
            .then(async (res) => {
                if (!res.errorCode) {
                    return res;
                }
            })
            .catch(() => {

            })
    }
}
