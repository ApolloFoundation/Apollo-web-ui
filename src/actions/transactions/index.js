/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import axios from 'axios/index';
// import fetch from 'fetch';
import config from '../../config';
import queryString from 'query-string';

export function getTransactionsAction(requestParams) {
    return dispatch => {
        const requestType = (requestParams.publicKey) ? 'getPrivateBlockchainTransactions' : 'getBlockchainTransactions';

        let params = requestParams;

        if (!params.requestType) {
            delete params.requestType;
        }

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

export function getPrivateTransactionAction(requestParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params : {
                requestType: 'getPrivateTransaction',
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

        fetch(config.api.serverUrl + "requestType=sendMoney",{
            method: 'POST',
            body: JSON.stringify(requestParams)
        })

            .then((res) => {
                if (!res.data.errorCode) {
                    return res.data;
                }
                return;
            })
            .catch((err) => {
                console.log(err);
            })
        // axios.post(config.api.serverUrl , {
        //     params : {
        //         requestType: 'sendMoney'
        //     },
        //     body: {
        //         ...requestParams
        //     }
        // })
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