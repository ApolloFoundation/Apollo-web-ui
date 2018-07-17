import axios from 'axios/index';
import config from '../../config';

export function getAccountLedgerAction(requestParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params : {
                requestType: 'getAccountLedger',
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
                requestType: 'getTransaction',
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