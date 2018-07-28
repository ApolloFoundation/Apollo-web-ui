import config from '../../config';
import axios from 'axios';

export function getAssetsAction(reqParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getAssets',
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