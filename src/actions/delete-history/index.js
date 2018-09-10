import axios from "axios";
import config from "../../config";

export const getDeleteHistory = account => dispatch => axios.get(config.api.serverUrl, {
    params: {
        requestType: 'getAssetDeletes',
        account,
        includeAssetInfo: true,
        firstIndex: 0,
        lastIndex: 15,
        random: Math.random()
    }
}).then((res) => {
    if (!res.data.errorCode) {
        return res.data
    }
});