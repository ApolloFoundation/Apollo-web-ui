import axios from "axios";
import config from "../../config";
import Marketplace from "../../containers/account/marketplace";

export const getSellOrdersAction = account => dispatch => axios.get(config.api.serverUrl, {
    params: {
        requestType: 'getAccountCurrentAskOrders',
        account,
        firstIndex: 0,
        lastIndex: 100,
        random: Math.random()
    }
}).then((res) => {
    if (!res.data.errorCode) {
        return res.data
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
}).then((res) => {
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