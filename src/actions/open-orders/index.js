/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import axios from "axios";
import config from "../../config";
import Marketplace from "../../containers/account/marketplace";
import store from '../../store'
import {getAssetAction} from "../assets";

export const getSellOrdersAction = account => dispatch =>
    axios.get(config.api.serverUrl, {
        params: {
            requestType: 'getAccountCurrentAskOrders',
            account,
            firstIndex: 0,
            lastIndex: 100,
            random: Math.random()
        }
    })
        .then(async (res) => {
            if (!res.data.errorCode) {
                const assets = res.data.askOrders.map((el, index) => {
                    return store.dispatch(getAssetAction({
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

export const getBuyOrdersAction = account => dispatch => axios.get(config.api.serverUrl, {
    params: {
        requestType: 'getAccountCurrentBidOrders',
        account,
        firstIndex: 0,
        lastIndex: 100,
        random: Math.random()
    }
}).then(async (res) => {
    if (!res.data.errorCode) {
        const assets = res.data.bidOrders.map((el, index) => {
            return store.dispatch(getAssetAction({
                asset: el.asset
            }))
        });

        return {assets: await Promise.all(assets), orders: res.data.bidOrders};
            // .then((assets) => {
            //
            //     console.log(assets);
            //      assets;
            // });
    }
    // console.log('Error: ', res.data.errorCode);
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
    // console.log('Error: ', res.data.errorCode);
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