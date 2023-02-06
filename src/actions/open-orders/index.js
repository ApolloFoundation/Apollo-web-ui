/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import axios from "axios";
import {getAssetAction} from "actions/assets";
import config from "config";

export const getSellOrdersAction = reqParams => dispatch =>
    axios.get(config.api.serverUrl, {
        params: {
            requestType: 'getAccountCurrentAskOrders',
            random: Math.random(),
            ...reqParams
        }
    })
        .then(async (res) => {
            if (!res.data.errorCode) {
                const assets = res.data.askOrders.map((el) => {
                    return dispatch(getAssetAction({
                        asset: el.asset
                    }))
                });

                return {assets: await Promise.all(assets), orders: res.data.askOrders};
            }
});

export const getClearSellOrdersAction = account => dispatch => axios.get(config.api.serverUrl, {
    params: {
        requestType: 'getAccountCurrentAskOrders',
        account,
        firstIndex: 0,
        lastIndex: 100,
        random: Math.random()
    }
}).then((res) => {
    if (!res.data.errorCode) {
        return res.data.askOrders;

    }
});

export const getBuyOrdersAction = reqParams => dispatch =>
    axios.get(config.api.serverUrl, {
        params: {
            requestType: 'getAccountCurrentBidOrders',
            random: Math.random(),
            ...reqParams
        }
    })
        .then(async (res) => {
            if (!res.data.errorCode) {
                const assets = res.data.bidOrders.map((el) => {
                    return dispatch(getAssetAction({
                        asset: el.asset
                    }))
                });

                return {assets: await Promise.all(assets), orders: res.data.bidOrders};

            }
            if (!res.data.errorCode) {
                return res.data
            }
        });

export const getClearBuyOrdersAction = account => dispatch => axios.get(config.api.serverUrl, {
    params: {
        requestType: 'getAccountCurrentBidOrders',
        account,
        firstIndex: 0,
        lastIndex: 100,
        random: Math.random()
    }
}).then((res) => {
    if (!res.data.errorCode) {
        return res.data.bidOrders
    }
    if (!res.data.errorCode) {
        return res.data
    }
});

export const getOrderInfoAction = order => dispatch => {
    return axios.get(config.api.serverUrl, {
        params: {
            requestType: "getAsset",
            asset: order,
            random: Math.random()
        }
    }).then(res => {
        if (!res.data.errorCode) {
            return res.data;
        }
    })
};