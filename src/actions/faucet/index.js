/******************************************************************************
 * Copyright © 2019 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

import config from '../../config';
import {GET, handleFetch} from "../../helpers/fetch";
import {NotificationManager} from "react-notifications";
import axios from "axios";
import {login} from "../../modules/account";

export function getCoins(requestParams) {
    return dispatch => {
        return handleFetch(`${config.api.faucetUrl}/back-faucet`, GET, requestParams)
            .then((res) => {
                return res;
            })
            .catch((e) => {
                NotificationManager.error('Please try again later.', 'Error', 5000);
            })
    }
}


export function getFaucetAccountInfoAction(account) {
    return (dispatch, getStore) => {
        return axios.get(`${config.api.faucetUrl}/apl?`, {
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
                    return res.data;
                }
            })
    }
}
