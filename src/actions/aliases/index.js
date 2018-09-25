import config from '../../config';
import axios from 'axios';
import {login} from "../../modules/account";

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
                // console.log('Error: ', res.data.errorCode);
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
                // console.log('Error: ', res.data.errorCode);
            })
            .catch((err) => {
                console.log(err);
            })

    }
}

export function buyAliasAction(requestParams) {
    return dispatch => {
        return fetch(config.api.serverUrl + "requestType=buyAlias", {
            method: 'POST',
            body: JSON.stringify(requestParams)
        })
    }
}

export function deleteAliasAction(requestParams) {
    return dispatch => {
        return fetch(config.api.serverUrl + "requestType=deleteAlias", {
            method: 'POST',
            body: JSON.stringify(requestParams)
        })
    }
}

export function sellAliasAction(requestParams) {
    return dispatch => {
        return fetch(config.api.serverUrl + "requestType=buyAlias", {
            method: 'POST',
            body: JSON.stringify(requestParams)
        })
    }
}

export function setAliasAction(requestParams) {
    return dispatch => {
        return fetch(config.api.serverUrl + "requestType=buyAlias", {
            method: 'POST',
            body: JSON.stringify(requestParams)
        })
    }
}
