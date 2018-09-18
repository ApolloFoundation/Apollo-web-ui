import axios from "axios";
import config from "../../config";

export const getApprovesAction = account => dispatch => {
    return axios.get(config.api.serverUrl, {
        params: {
            requestType: 'getVoterPhasedTransactions',
            account,
            firstIndex: 0,
            lastIndex: 15,
            random: Math.random(),
        }
    })
        .then(res => {
            if (!res.data.errorCode) {
                return res.data
            }
        })
        .catch(() => {

        })
};