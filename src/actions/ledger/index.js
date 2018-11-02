/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import axios from 'axios/index';
import config from '../../config';

export function getAccountLedgerAction(requestParams) {
    return dispatch => {

        const condition = requestParams.passphrase || requestParams.secretPhrase;
        const requestType = (condition) ? 'getPrivateAccountLedger' : 'getAccountLedger';

            return axios.get(config.api.serverUrl, {
                params : {
                    requestType: requestType,
                    ...requestParams
                }
            })
                .then((res) => {
                    return res.data
                })
                .catch(() => {

                })
    }
}

export function getLedgerEntryAction(requestParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params : {
                requestType: (requestParams.passphrase) ? 'getPrivateAccountLedgerEntry' : 'getAccountLedgerEntry',
                ...requestParams
            }
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
