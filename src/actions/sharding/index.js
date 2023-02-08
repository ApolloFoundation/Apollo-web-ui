/******************************************************************************
 * Copyright © 2020 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

import {NotificationManager} from "react-notifications";
import config from 'config';
import {handleFetch, GET} from "helpers/fetch";

export function getShards(requestParams) {
    return () => {
        return handleFetch(`${config.api.server}/rest/shards`, GET, requestParams)
            .then(async (res) => {
                if (!res.errorCode) {
                    return res;
                } else {
                    NotificationManager.error(res.errorDescription, 'Error', 5000);
                }
            })
            .catch(() => {
            })
    }
}