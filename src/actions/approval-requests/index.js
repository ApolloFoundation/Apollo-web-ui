/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import axios from "axios";
import config from "../../config";

export const getApprovesAction = ({account, firstIndex, lastIndex}) => dispatch => {
    return axios.get(config.api.serverUrl, {
        params: {
            requestType: 'getVoterPhasedTransactions',
            account,
            firstIndex,
            lastIndex,
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