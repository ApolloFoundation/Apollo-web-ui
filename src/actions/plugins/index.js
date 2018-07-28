import config from '../../config';
import axios from 'axios';

export function getPluginsAction(reqParams) {
    return dispatch => {
        return  axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getPlugins'
            }
        })
            .then((res) => {
                if(res.data) {
                    return res.data
                }
            })
            .catch(() => {

            })
    }
}