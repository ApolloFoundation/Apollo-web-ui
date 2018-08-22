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
                console.log('Error: ', res.data.errorCode);
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
                console.log('Error: ', res.data.errorCode);
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
                console.log('Error: ', res.data.errorCode);
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
                asset: 5996019989653579881,
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
                console.log('Error: ', res.data.errorCode);
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
                console.log('Error: ', res.data.errorCode);
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
                console.log('Error: ', res.data.errorCode);
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
            body: JSON.stringify(requestParams)
        })
    }
}

export function transferAssetAction(requestParams) {
    return dispatch => {
        return fetch(config.api.serverUrl + "requestType=transferAsset", {
            method: 'POST',
            body: JSON.stringify(requestParams)
        })
    }
}


