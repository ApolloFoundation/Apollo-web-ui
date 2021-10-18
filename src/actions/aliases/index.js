/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import config from '../../config';
import axios from 'axios';
import {processElGamalEncryption} from "../crypto";
import cancelAxiosRequest from '../../helpers/cancelToken';

export function searchAliases(reqParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getAliasesLike',
                ...reqParams,
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

export function getAliasesAction(reqParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getAliases',
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

export function getAliasesCountAction(requestParams) {
    return (dispatch, getState) => {

        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getAliasCount',
                ...requestParams
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

export function getAliasAction(requestParams) {
    return (dispatch, getState) => {
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getAlias',
                ...requestParams
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

export function buyAliasAction(requestParams) {
    return async () => {
        let data = requestParams;
        if (data.passphrase) data.passphrase = await processElGamalEncryption(data.passphrase);
        else if (data.secretPhrase) data.secretPhrase = await processElGamalEncryption(data.secretPhrase);
        return fetch(config.api.serverUrl + "requestType=buyAlias", {
            method: 'POST',
            body: JSON.stringify(data)
        })
    }
}

export function deleteAliasAction(requestParams) {
    return async () => {
        let data = requestParams;
        if (data.passphrase) data.passphrase = await processElGamalEncryption(data.passphrase);
        else if (data.secretPhrase) data.secretPhrase = await processElGamalEncryption(data.secretPhrase);
        return fetch(config.api.serverUrl + "requestType=deleteAlias", {
            method: 'POST',
            body: JSON.stringify(data)
        })
    }
}

export function sellAliasAction(requestParams) {
    return async () => {
        let data = requestParams;
        if (data.passphrase) data.passphrase = await processElGamalEncryption(data.passphrase);
        else if (data.secretPhrase) data.secretPhrase = await processElGamalEncryption(data.secretPhrase);
        return fetch(config.api.serverUrl + "requestType=buyAlias", {
            method: 'POST',
            body: JSON.stringify(data)
        })
    }
}

export function setAliasAction(requestParams) {
    return async () => {
        let data = requestParams;
        if (data.passphrase) data.passphrase = await processElGamalEncryption(data.passphrase);
        else if (data.secretPhrase) data.secretPhrase = await processElGamalEncryption(data.secretPhrase);
        return fetch(config.api.serverUrl + "requestType=buyAlias", {
            method: 'POST',
            body: JSON.stringify(data)
        })
    }
}
