/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import config from '../../config';
import axios from 'axios';
import {processElGamalEncryption} from "../crypto";
import { cancelAxiosSource } from '../../helpers/cancelToken';

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
                includeAssetInfo: true,
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

export function getDividendsHistory(reqParams) {
    return axios.get(config.api.serverUrl, {
        params: {
            requestType: 'getAssetDividends',
            ...reqParams
        }})
        .then(res => {
            if (!res.data.errorCode) {
                return res.data;
            }
        })
        .catch(err => {
            console.error(err);
        })
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
            },
            cancelToken: cancelAxiosSource.token,
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
    return async () => {
        let data = requestParams;
        if (data.passphrase) data.passphrase = await processElGamalEncryption(data.passphrase);
        else if (data.secretPhrase) data.secretPhrase = await processElGamalEncryption(data.secretPhrase);
        return fetch(config.api.serverUrl + "requestType=placeBidOrder", {
            method: 'POST',
            body: JSON.stringify(data)
        })
    }
}

export function sellAssetAction(requestParams) {
    return async () => {
        let data = requestParams;
        if (data.passphrase) data.passphrase = await processElGamalEncryption(data.passphrase);
        else if (data.secretPhrase) data.secretPhrase = await processElGamalEncryption(data.secretPhrase);
        return fetch(config.api.serverUrl + "requestType=placeAskOrder", {
            method: 'POST',
            body: JSON.stringify(data)
        })
    }
}

export function issueAssetAction(requestParams) {
    return async () => {
        let data = requestParams;
        if (data.passphrase) data.passphrase = await processElGamalEncryption(data.passphrase);
        else if (data.secretPhrase) data.secretPhrase = await processElGamalEncryption(data.secretPhrase);
        return fetch(config.api.serverUrl + "requestType=issueAsset", {
            method: 'POST',
            headers: {
                "Content-Type": "contentType:application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: JSON.stringify(data)
        })
    }
}

export function transferAssetAction(requestParams) {
    return async () => {
        let data = requestParams;
        if (data.passphrase) data.passphrase = await processElGamalEncryption(data.passphrase);
        else if (data.secretPhrase) data.secretPhrase = await processElGamalEncryption(data.secretPhrase);
        return fetch(config.api.serverUrl + "requestType=transferAsset", {
            method: 'POST',
            headers: {
                "Content-Type": "contentType:application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: data
        })
    }
}


