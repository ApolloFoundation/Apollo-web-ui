import config from '../../config';
import axios from 'axios';

export function getPluginsAction(reqParams) {
    console.log(33322222);

    return dispatch => {
        console.log(333);
        return  axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getPlugins'
            }

        })
            .then((res) => {
                console.log(res);
                if(res.data) {
                    return res.data
                }
            })
            .catch(() => {

            })
    }
}