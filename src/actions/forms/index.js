import axios from 'axios'
import config from '../../config'
import queryString from 'query-string';


export function calculateFeeAction(requestParams) {
    return (dispatch) => {
        return axios.post(config.api.serverUrl + queryString.stringify(requestParams))
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                console.log(err);
            })
    }
}