/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import axios from 'axios/index';
import config from '../../config';
import {SET_CURRENT_BLOCK} from "../../modules/account";

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

export function getBlockAction(requestParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getBlock',
                includeTransactions: true,
                includeExecutedPhased: true,
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

export const startBlockPullingAction = () => axios.get(config.api.serverUrl, {
    params: {
        requestType: 'getBlock'
    }
})
    .then((res) => {
        return res.data;
    })
    .catch(() => {

    });

export const getNextBlockGeneratorsAction = (reqParams) => axios.get(config.api.serverUrl, {
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
