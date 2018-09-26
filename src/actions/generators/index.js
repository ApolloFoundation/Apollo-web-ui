/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import axios from 'axios';
import config from '../../config';

export const getGeneratorsAction = () => dispatch => {
    return axios.get(config.api.serverUrl, {
        params: {
            requestType: "getNextBlockGenerators",
            limit: 10,
            random: Math.random()
        }
    })
        .then(res => {
            if (!res.data.errorCode) {
                return res.data;
            }
        });
};