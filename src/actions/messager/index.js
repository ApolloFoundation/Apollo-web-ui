import axios from 'axios';
import config from '../../config'

export function getMessages (reqParams) {
    return dispatch => {
        console.log(reqParams);
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getBlockchainTransactions',
                type: 1,
                subtype: 0,
                ...reqParams
            }
        })
            .then((res) => {
                if(!res.data.errorMessage) {
                    return res.data;
                }
            })
    }
}