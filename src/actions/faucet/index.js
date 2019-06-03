/******************************************************************************
 * Copyright © 2019 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

import config from '../../config';
import {GET, handleFetch} from "../../helpers/fetch";
import {NotificationManager} from "react-notifications";

export function getCoins(requestParams) {
    return dispatch => {
        return handleFetch(config.api.faucetUrl, GET, requestParams)
            .then((res) => {
                return res;
            })
            .catch((e) => {
                NotificationManager.error('Please try again later.', 'Error', 5000);
            })
    }
}
