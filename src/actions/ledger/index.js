import axios from 'axios/index';
import config from '../../config';

export function getAccountLedgerAction(requestParams) {
    return dispatch => {
        const requestType = (requestParams.publicKey) ? 'getPrivateAccountLedger' : 'getAccountLedger';
        return axios.get(config.api.serverUrl, {
            params : {
                requestType: requestType,
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

export function getLedgerEntryAction(requestParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params : {
                requestType: 'getAccountLedgerEntry',
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
