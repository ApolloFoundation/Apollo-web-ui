import axios from 'axios/index';
import config from '../../config';

export function getBlocksAction(requestParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params : {
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
            params : {
                requestType: 'getBlock',
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