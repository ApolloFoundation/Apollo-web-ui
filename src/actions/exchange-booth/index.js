/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import axios from "axios";
import config from "../../config";

export const getBuyOffersAction = (reqParams) => dispatch => {
    return axios.get(config.api.serverUrl, {
        params: {
            requestType: 'getBuyOffers',
            availableOnly: true,
            random: Math.random(),
            ...reqParams
        }
    }).then((res) => {
        if (!res.data.errorCode) {
            return res.data
        }
    });
};

export const getSellOffersAction = (reqParams) => dispatch => {
    return axios.get(config.api.serverUrl, {
        params: {
            requestType: 'getSellOffers',
            availableOnly: true,
            random: Math.random(),
            ...reqParams
        }
    }).then((res) => {
        if (!res.data.errorCode) {
            return res.data
        }
    });
};

export const getAccountExchangeAction = (reqParams) => dispatch => {
    return axios.get(config.api.serverUrl, {
        params: {
            requestType: 'getAccountExchangeRequests',
            random: Math.random(),
            ...reqParams
        }
    }).then((res) => {
        if (!res.data.errorCode) {
            return res.data
        }
    });
};

export const getExchangesAction = reqParams => dispatch => {
    return axios.get(config.api.serverUrl, {
        params: {
            requestType: 'getExchanges',
            includeCurrencyInfo: true,
            random: Math.random(),
            ...reqParams
        }
    }).then((res) => {
        if (!res.data.errorCode) {
            return res.data
        }
    });
};

export const getAccountExchangesAction = requestParams => dispatch => {
    return axios.get(config.api.serverUrl, {
        params: {
            requestType: 'getExchanges',
            ...requestParams,
            random: Math.random()
        }
    }).then((res) => {
        if (!res.data.errorCode) {
            return res.data
        }
    });
};