/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import axios from 'axios';
import config from '../../config';


export function getActiveShfflings(reqParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params: {
                'requestType': 'getAllShufflings',
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

export function getFinishedShfflings(reqParams) {
    return (dispatch, getState) => {
        const { account } = getState();

        return axios.get(config.api.serverUrl, {
            params: {
                'requestType': 'getAllShufflings',
                'finishedOnly': true,
                'includeHoldingInfo': true,
                'account': account.account,
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
            }
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

