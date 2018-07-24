import axios from 'axios/index';
import config from '../../config';

export function getTransactionsAction(requestParams) {
    return dispatch => {
        console.log(requestParams);
        const requestType = (requestParams.publicKey) ? 'getPrivateBlockchainTransactions' : 'getBlockchainTransactions';
        console.log(requestParams);

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

export function getTransactionAction(requestParams) {
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