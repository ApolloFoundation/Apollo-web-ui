/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import axios from 'axios';
import cancelAxiosRequest from 'helpers/cancelToken';
import {getAssetAction} from "actions/assets";
import {processElGamalEncryption} from "actions/crypto";
import config from '../../config';

export function getDGSGoodsAction(reqParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getDGSGoods',
                ...reqParams
            },
            cancelToken: cancelAxiosRequest.token,
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
            },
            cancelToken: cancelAxiosRequest.token,
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

export function getDGSPurchaseAction(reqParams) {
    return async () => {
        let data = reqParams;
        if (data.passphrase) data.passphrase = await processElGamalEncryption(data.passphrase);
        else if (data.secretPhrase) data.secretPhrase = await processElGamalEncryption(data.secretPhrase);
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getDGSPurchase',
                ...data
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
            },
            cancelToken: cancelAxiosRequest.token,
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

export function getAskOrders(reqParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getAskOrders',
                ...reqParams
            }
        })
            .then(async (res) => {
                if (!res.data.errorCode) {
                    const assets = res.data.askOrders.map((el, index) => {
                        return dispatch(getAssetAction({
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
};

export function getBidOrders(reqParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getBidOrders',
                ...reqParams
            }
        })
            .then(async (res) => {
                if (!res.data.errorCode) {
                    const assets = res.data.bidOrders.map((el, index) => {
                        return dispatch(getAssetAction({
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
};
