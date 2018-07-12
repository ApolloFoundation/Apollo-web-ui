import  axios from "axios/index";
import config from "../../config";

export function getAccountDataAction(requestParams) {
    console.log(requestParams);

    return axios.get(config.api.serverUrl, {
        params: {
            requestType: 'getAccount',
            ...requestParams
        }
    })
        .then((res) => {
            console.log(res.data);
            return res.data;
        })
        .catch(function(err){
            console.log(err)
        });

}