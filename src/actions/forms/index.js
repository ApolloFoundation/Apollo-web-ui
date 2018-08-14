import axios from 'axios'
import config from '../../config'
import queryString from 'query-string';


export function calculateFeeAction(requestParams) {
    return (dispatch) => {
        requestParams = {
            ...requestParams,
            requestType: 'sendMoney',
            deadline: '1440',
            amountATM: requestParams.amountATM * 100000000,
            feeATM: requestParams.feeATM * 100000000,
        };

        return axios.post(config.api.serverUrl + queryString.stringify(requestParams))
            .then((res) => {
                if (!res.data.errorCode) {
                    return res.data;
                }
                return;
            })
            .catch((err) => {
                console.log(err);
            })
    }
}