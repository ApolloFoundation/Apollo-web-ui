import axios from 'axios/index';
import config from '../../config';
import queryString from 'query-string';

export function getTransactionsAction(requestParams) {
    return dispatch => {
        const requestType = (requestParams.publicKey) ? 'getPrivateBlockchainTransactions' : 'getBlockchainTransactions';

        let params = requestParams;

        if (!params.requestType) {
            delete params.requestType;
        }

        console.log({
            requestType: requestType,
            ...params
        });
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

export function sendTransactionAction(requestParams) {
    return (dispatch) => {
        requestParams = {
            ...requestParams,
            requestType: 'sendMoney',
            deadline: '1440',
            amountATM: requestParams.amountATM * 100000000,
            feeATM: requestParams.feeATM * 100000000,
        };

        return axios.post(config.api.serverUrl + queryString.stringify(requestParams))
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

export function sendPrivateTransaction(requestParams) {
    return (dispatch) => {
        requestParams = {
            ...requestParams,
            requestType: 'sendMoneyPrivate',
            deadline: '1440',
            amountATM: requestParams.amountATM * 100000000,
            feeATM: requestParams.feeATM * 100000000,
        };

        return axios.post(config.api.serverUrl + queryString.stringify(requestParams))
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

export function formatTransactionType(str){
    str = str.replace(/([a-z\xE0-\xFF])([A-Z\xC0\xDF])/g, '$1 $2');
    str = str.toLowerCase(); //add space between camelCase text
    return (str).toUpperCase();
}