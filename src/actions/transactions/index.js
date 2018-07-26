import axios from 'axios/index';
import config from '../../config';
import queryString from 'query-string';

axios.defaults.headers.common['Access-Control-Request-Headers'] = null;
axios.defaults.headers.common['Access-Control-Request-Method'] = null;

export function getTransactionsAction(requestParams) {
    return dispatch => {
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

export function sendTransactionAction(requestParams) {
    return (dispatch) => {
        console.log(requestParams);

        requestParams = {
            ...requestParams,
            requestType: 'sendMoney',
            deadline: '1440',
            amountATM: requestParams.amountATM * 100000000,
            feeATM: requestParams.feeATM * 100000000,
        };

        console.log(requestParams);


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
        console.log(requestParams);

        requestParams = {
            ...requestParams,
            requestType: 'sendMoneyPrivate',
            deadline: '1440',
            amountATM: requestParams.amountATM * 100000000,
            feeATM: requestParams.feeATM * 100000000,
        };

        console.log(requestParams);


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