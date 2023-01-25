/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import axios from 'axios';
import config from '../../config';
import cancelAxiosRequest from '../../helpers/cancelToken';

export function getAllTaggedDataAction(reqParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getAllTaggedData',
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

export function getDataTagsAction(reqParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getDataTags',
                ...reqParams
            },
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

export function searchTaggedDataAction(reqParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'searchTaggedData',
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

export function getAccountTaggedDataAction(reqParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getAccountTaggedData',
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


