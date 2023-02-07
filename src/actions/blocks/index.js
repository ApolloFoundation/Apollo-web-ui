/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import axios from 'axios';
import {NotificationManager} from "react-notifications";
import config from 'config';
import cancelAxiosRequest from 'helpers/cancelToken';
import {GET, handleFetch} from "helpers/fetch";
import { loadBlockchainStatusAction } from 'modules/account';

export function getBlocksAction(requestParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getBlocks',
                ...requestParams
            }
        })
            .then((res) => {
                if (!res.data.errorCode) {
                    return res.data
                }
            })
            .catch(() => {

            })
    }
}

export function getForgedBlocksAction(requestParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getAccountBlocks',
                ...requestParams
            }
        })
            .then((res) => {
                if (!res.data.errorCode) {
                    return res.data
                }
            })
            .catch(() => {

            })
    }
}

export function getAccountBlockCountAction(requestParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getAccountBlockCount',
                ...requestParams
            }
        })
            .then((res) => {
                if (!res.data.errorCode) {
                    return res.data
                }
            })
            .catch(() => {

            })
    }
}

export function getBlockAction(requestParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getBlock',
                includeTransactions: true,
                includeExecutedPhased: true,
                ...requestParams
            },
            cancelToken: cancelAxiosRequest.token,
        })
            .then((res) => {
                if (!res.data.errorCode) {
                    return res.data
                }
            })
            .catch(() => {

            })
    }
}

export const startBlockPullingAction = () => () => axios.get(config.api.serverUrl, {
    params: {
        requestType: 'getBlock'
    }
})
    .then((res) => {
        return res.data;
    })
    .catch(() => {

    });

export const getNextBlockGeneratorsAction = (reqParams) => () => axios.get(config.api.serverUrl, {
    params: {
        requestType: 'getNextBlockGenerators',
        ...reqParams
    }
})
    .then((res) => {
        return res.data;
    })
    .catch(() => {

    });

export function getBackendStatus(requestParams) {
    return (dispatch) => {
        return handleFetch(`${config.api.server}/rest/control/status`, GET, requestParams)
            .then((res) => {
                if (!res.errorCode) {
                    dispatch(loadBlockchainStatusAction(res))
                    return res;
                } else {
                    NotificationManager.error(res.errorDescription, 'Error', 5000);
                }
            })
            .catch(() => {

            })
    }
}
