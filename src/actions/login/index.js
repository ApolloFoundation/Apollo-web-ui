import  axios from "axios/index";
import config from "../../config";
import { login } from '../../modules/account';

export function getAccountDataAction(requestParams) {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getAccount',
                ...requestParams
            }
        })
            .then((res) => {
                console.log(res.data);
                dispatch(login(res.data));
            })
            .catch(function(err){
                console.log(err)
            });
    };
}
