/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import {readFromLocalStorage} from "actions/localStorage";
import {storageSelect} from 'actions/localStorage'
import {storageInsert} from 'actions/localStorage'
import async from './async'

import {DEFAULT_COLORS} from '../internationalisation/languages-data';

export const defaultSettings = {
    "submit_on_enter": "0",
    "animate_forging": "1",
    "marketplace": "-1",
    "exchange": "-1",
    "console_log": "0",
    "fee_warning": "100000000000",
    "amount_warning": "10000000000000",
    "asset_transfer_warning": "10000",
    "currency_transfer_warning": "10000",
    "24_hour_format": "1",
    "language": "en",
    "regional_format": "default",
    "enable_plugins": "0",
    "items_page": "15",
    "admin_password": "",
    "max_apl_decimals": "2",
    "fake_entity_warning": "1"
};

export function getSettings(isAccountSpecific) {
    return (dispatch, getState) => {
        const {account} = getState();

        if (!account.account) {
            dispatch({
                type: 'SET_SETTINGS',
                payload: defaultSettings
            });
            const language = readFromLocalStorage("language");
            if (language) {

                dispatch({
                    type: 'SET_SETTINGS',
                    payload: {
                        ...defaultSettings,
                        language,
                    }
                });
            }

        // TODO implemenr internationalisation  
        } else {
            async.waterfall([
                function(callback) {
                    dispatch(storageSelect("data", [{
                        "id": "settings"
                    }], function (error, result) {
                        if (result && result.length) {
                            dispatch({
                                type: 'SET_SETTINGS',
                                payload: {
                                    ...defaultSettings,
                                    ...JSON.parse(result[0].contents)
                                }
                            })
                        } else {
                            dispatch(storageInsert("data", "id", {
                                id: "settings",
                                contents: "{}"
                            }));
                            dispatch({
                                type: 'SET_SETTINGS',
                                payload: {
                                    ...defaultSettings
                                }
                            })
                        }
                        for (var setting in account.defaultSettings) {
                            if (!account.defaultSettings.hasOwnProperty(setting)) {
                                continue;
                            }
                            var value = account.settings[setting];
                            var status = (defaultSettings[setting] !== value ? "modified" : "default");
                            if (setting.search("password") >= 0) {
                                value = new Array(value.length + 1).join('*');
                            }
                        }
                        callback(null);
                    }))
                },
                function(callback) {
                    for (var schema in DEFAULT_COLORS) {
                        if (!DEFAULT_COLORS.hasOwnProperty(schema)) {
                            continue;
                        }
                        var color = account.settings[schema + "_color"];
                    }
                    callback(null);
                }
            ], function(err, result) {});

        }
    }
};