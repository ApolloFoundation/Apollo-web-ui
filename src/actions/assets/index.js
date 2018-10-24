/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import config from '../../config';
import axios from 'axios';

export function getAssetsAction(reqParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getAssets',
                includeAssetInf: true,
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

export function getSpecificAccountAssetsAction(reqParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getAccountAssets',
                includeAssetInf: true,
                ...reqParams
            }
        })
            .then(async (res) => {
                if (!res.data.errorCode) {

                    const assets = res.data.accountAssets.map((el, index) => {
                        return dispatch(getAssetAction({
                            asset: el.asset
                        }))
                    });

                    return {assets: await (Promise.all(assets)), accountAssets: res.data.accountAssets}


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
                requestType: 'getAssetTransfers',
                includeAssetInfo: true,
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

export function getTradesHistoryAction(reqParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getTrades',
                includeAssetInfo: true,
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

export function getAssetAction(reqParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getAsset',
                phasingVotingModel: 0,
                phasingQuorum: 1,
                phasingWhitelisted: 3958487933422064851,
                phased: true,
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

export function getAccountAssetCountAction(reqParams) {
    return (dispatch, getState) => {

        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getAccountAssetCount',
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

export function getAccountAssetsAction(reqParams) {
    return (dispatch, getState) => {

        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getAccountAssets',
                includeAssetInfo: true,
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

export function buyAssetAction(requestParams) {
    return dispatch => {
        return fetch(config.api.serverUrl + "requestType=placeBidOrder", {
            method: 'POST',
            body: JSON.stringify(requestParams)
        })
    }
}

export function sellAssetAction(requestParams) {
    return dispatch => {
        return fetch(config.api.serverUrl + "requestType=placeAskOrder", {
            method: 'POST',
            body: JSON.stringify(requestParams)
        })
    }
}

export function issueAssetAction(requestParams) {
    return dispatch => {

        return fetch(config.api.serverUrl + "requestType=issueAsset", {
            method: 'POST',
            headers: {
                "Content-Type": "contentType:application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: "name=Test2Test&description=Test&decimals=0&deadline=1440&phased=false&phasingLinkedFullHash=&phasingHashedSecret=&phasingHashedSecretAlgorithm=2&publicKey=ffbc7ba2e4c43be03f8a7f020d0651f582ad1901c254eebb4ec2ecb73148e50d&quantityATU=100&feeATM=100000000000&ecBlockId=11255812614937856744&ecBlockHeight=0"
        })
    }
}

export function transferAssetAction(requestParams) {
    return dispatch => {

        const formData  = new FormData(requestParams);

        return fetch(config.api.serverUrl + "requestType=transferAsset", {
            method: 'POST',
            headers: {
                "Content-Type": "contentType:application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: requestParams
        })
    }
}


