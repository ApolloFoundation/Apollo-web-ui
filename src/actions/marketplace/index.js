import config from '../../config';
import axios from 'axios';
import store from "../../store";
import {getAssetAction} from "../assets";

export function getDGSGoodsAction(reqParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getDGSGoods',
                ...reqParams
            }
        })
            .then((res) => {
                if (!res.data.errorCode) {
                    return res.data;
                }
                // console.log('Error: ', res.data.errorCode);
            })
            .catch((err) => {
                console.log(err);
            })

    }
}

export function getDGSTagsAction(reqParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getDGSTags',
                ...reqParams
            }
        })
            .then((res) => {
                if (!res.data.errorCode) {
                    return res.data;
                }
                // console.log('Error: ', res.data.errorCode);
            })
            .catch((err) => {
                console.log(err);
            })

    }
}

export function getDGSTagCountAction(reqParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getDGSTagCount',
                ...reqParams
            }
        })
            .then((res) => {
                if (!res.data.errorCode) {
                    return res.data;
                }
                // console.log('Error: ', res.data.errorCode);
            })
            .catch((err) => {
                console.log(err);
            })

    }
}

export function getDGSPurchaseCountAction(reqParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getDGSPurchaseCount',
                ...reqParams
            }
        })
            .then((res) => {
                if (!res.data.errorCode) {
                    return res.data;
                }
                // console.log('Error: ', res.data.errorCode);
            })
            .catch((err) => {
                console.log(err);
            })

    }
}

export function getDGSGoodsCountAction(reqParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getDGSGoodsCount',
                ...reqParams
            }
        })
            .then((res) => {
                if (!res.data.errorCode) {
                    return res.data;
                }
                // console.log('Error: ', res.data.errorCode);
            })
            .catch((err) => {
                console.log(err);
            })

    }
}

export function getDGSGoodAction(reqParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getDGSGood',
                ...reqParams
            }
        })
            .then((res) => {
                if (!res.data.errorCode) {
                    return res.data;
                }
                // console.log('Error: ', res.data.errorCode);
            })
            .catch((err) => {
                console.log(err);
            })

    }
}

export function getDGSPurchasesAction(reqParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getDGSPurchases',
                ...reqParams
            }
        })
            .then((res) => {
                if (!res.data.errorCode) {
                    return res.data;
                }
                // console.log('Error: ', res.data.errorCode);
            })
            .catch((err) => {
                console.log(err);
            })
    }
}

export function getDGSPurchaseAction(reqParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getDGSPurchase',
                ...reqParams
            }
        })
            .then((res) => {
                if (!res.data.errorCode) {
                    return res.data;
                }
                // console.log('Error: ', res.data.errorCode);
            })
            .catch((err) => {
                console.log(err);
            })
    }
}

export function searchDGSGoodsAction(reqParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'searchDGSGoods',
                ...reqParams
            }
        })
            .then((res) => {
                if (!res.data.errorCode) {
                    return res.data;
                }
                // console.log('Error: ', res.data.errorCode);
            })
            .catch((err) => {
                console.log(err);
            })
    }
}

export function getDGSPendingPurchases(reqParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getDGSPendingPurchases',
                ...reqParams
            }
        })
            .then((res) => {
                if (!res.data.errorCode) {
                    return res.data;
                }
                // console.log('Error: ', res.data.errorCode);
            })
            .catch((err) => {
                console.log(err);
            })
    }
}

export const getAskOrders = asset => {
    return axios.get(config.api.serverUrl, {
        params: {
            requestType: 'getAskOrders',
            asset
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
        })
        .catch((err) => {
            console.log(err);
        });
}

export const getBidOrders = asset => {
    return axios.get(config.api.serverUrl, {
        params: {
            requestType: 'getBidOrders',
            asset
        }
    })
        .then(async (res) => {
            if (!res.data.errorCode) {
                const assets = res.data.bidOrders.map((el, index) => {
                    return store.dispatch(getAssetAction({
                        asset: el.asset
                    }))
                });

                return {assets: await Promise.all(assets), orders: res.data.bidOrders};

            }
        })
        .catch((err) => {
            console.log(err);
        })
}




