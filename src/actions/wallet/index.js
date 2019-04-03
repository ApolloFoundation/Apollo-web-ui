/******************************************************************************
 * Copyright © 2019 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

import config from '../../config';
import {writeToLocalStorage} from "../localStorage";
import {setWallets} from "../../modules/account";
import {handleFetch, GET, POST} from "../../helpers/fetch";

export function getWallets(requestParams) {
    return dispatch => {
        return handleFetch(`${config.api.server}/rest/keyStore/accountInfo`, POST, requestParams)
            .then(async (res) => {
                if (!res.errorCode) {
                    dispatch(setWallets(res.currencies));
                    writeToLocalStorage('wallets', JSON.stringify(res.currencies));
                    return res;
                }
            })
            .catch(() => {

            })
    }
}

export function getCurrencyBalance(requestParams) {
    return dispatch => {
        return handleFetch(`${config.api.server}/rest/dex/balance`, GET, requestParams)
            .then((res) => {
                if (!res.errorCode) {
                    return res;
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
