/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import axios from "axios";
import config from "../../config";

export const getDeleteHistory = (account, firstIndex, lastIndex) => dispatch => axios.get(config.api.serverUrl, {
    params: {
        requestType: 'getAssetDeletes',
        account,
        includeAssetInfo: true,
        firstIndex: firstIndex || 0,
        lastIndex: lastIndex || 15,
        random: Math.random()
    }
}).then((res) => {
    if (!res.data.errorCode) {
        return res.data
    }
});
