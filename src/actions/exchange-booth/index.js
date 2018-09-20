import axios from "axios";
import config from "../../config";

export const getBuyOffersAction = currency => dispatch => {
    return axios.get(config.api.serverUrl, {
        params: {
            requestType: 'getBuyOffers',
            currency,
            availableOnly: true,
            firstIndex: 0,
            lastIndex: 15,
            random: Math.random()
        }
    }).then((res) => {
        if (!res.data.errorCode) {
            return res.data
        }
    });
};

export const getSellOffersAction = currency => dispatch => {
    return axios.get(config.api.serverUrl, {
        params: {
            requestType: 'getSellOffers',
            currency,
            availableOnly: true,
            firstIndex: 0,
            lastIndex: 15,
            random: Math.random()
        }
    }).then((res) => {
        if (!res.data.errorCode) {
            return res.data
        }
    });
};

export const getAccountExchangeAction = (currency, account) => dispatch => {
    return axios.get(config.api.serverUrl, {
        params: {
            requestType: 'getAccountExchangeRequests',
            currency,
            account,
            includeCurrencyInfo: true,
            firstIndex: 0,
            lastIndex: 15,
            random: Math.random()
        }
    }).then((res) => {
        if (!res.data.errorCode) {
            return res.data
        }
    });
};

export const getExchangesAction = currency => dispatch => {
    return axios.get(config.api.serverUrl, {
        params: {
            requestType: 'getExchanges',
            currency,
            includeCurrencyInfo: true,
            firstIndex: 0,
            lastIndex: 15,
            random: Math.random()
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
            requestType: 'getExchangesByExchangeRequest',
            ...requestParams,
            includeInfo: true,
            random: Math.random()
        }
    }).then((res) => {
        if (!res.data.errorCode) {
            return res.data
        }
    });
};