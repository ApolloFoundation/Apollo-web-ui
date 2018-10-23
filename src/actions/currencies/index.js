/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import config from '../../config';
import axios from 'axios';

export function getAliasesAction(reqParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getAliases',
                ...reqParams
            }
        })
            .then((res) => {
                if (!res.data.errorCode) {
                    return res.data;
                }
            })
            .catch((err) => {
                console.log(err);
            })

    }
}

export function getAllCurrenciesAction(reqParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getAllCurrencies',
                includeCurrencyInfo: true,
                ...reqParams
            }
        })
            .then((res) => {
                if (!res.data.errorCode) {
                    return res.data;
                }
            })
            .catch((err) => {
                console.log(err);
            })

    }
}

export function getAccountCurrenciesAction(reqParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getAccountCurrencies',
                includeCurrencyInfo: true,
                ...reqParams
            }
        })
            .then((res) => {
                if (!res.data.errorCode) {
                    return res.data;
                }
            })
            .catch((err) => {
                console.log(err);
            })

    }
}

export function getCurrencyAction(reqParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getCurrency',
                ...reqParams
            }
        })
            .then((res) => {
                if (!res.data.errorCode) {
                    return res.data;
                }
            })
            .catch((err) => {
                console.log(err);
            })

    }
}

export function getTransferHistory(reqParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getCurrencyTransfers',
                includeCurrencyInfo: true,
                random: 0.004660718106320294,
                ...reqParams
            }
        })
            .then((res) => {
                if (!res.data.errorCode) {
                    return res.data;
                }
            })
            .catch((err) => {
                console.log(err);
            })

    }
}

