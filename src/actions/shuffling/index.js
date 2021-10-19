/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import axios from 'axios';
import config from '../../config';
import cancelAxiosRequest from '../../helpers/cancelToken';

export function getActiveShfflings(reqParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params: {
                'requestType': 'getAllShufflings',
                'includeHoldingInfo': true,
                ...reqParams
            },
            cancelToken: cancelAxiosRequest.token,
        })
            .then((res) => {
                if (!res.data.errorCode) {
                    return res.data
                }
            })
    }
}

export function getFinishedShfflings(reqParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params: {
                'requestType': 'getAllShufflings',
                'finishedOnly': true,
                'includeHoldingInfo': true,
                ...reqParams
            }
        })
            .then((res) => {
                if (!res.data.errorCode) {
                    return res.data
                }
            })
    }
}

export function getShufflingAction(reqParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params: {
                'requestType': 'getShuffling',
                ...reqParams
            },
            cancelToken: cancelAxiosRequest.token,
        })
            .then((res) => {
                if (!res.data.errorCode) {
                    return res.data
                }
            })
    }
}

export function getAccountShufflingsAction(reqParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params: {
                'requestType': 'getAccountShufflings',
                ...reqParams
            }
        })
            .then((res) => {
                if (!res.data.errorCode) {
                    return res.data
                }
            })
    }
}

