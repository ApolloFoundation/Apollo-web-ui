/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import {readFromLocalStorage, writeToLocalStorage} from "actions/localStorage";

export const LOAD_SETTINGS = "LOAD_SETTINGS";

const initState = {
    bootstrap_nodes_count: 5,
    is_check_remember_me: false,
    is_remote_node_ssl: false,
    is_simulate_app: false,
    is_store_remembered_passphrase: false,
    is_testnet: false,
    remote_node_address: "",
    remote_node_port: 7876,
    validators_count: 3,
};

export default (state = initState, action) => {
    switch (action.type) {
        case LOAD_SETTINGS:
            return {
                ...action.settings
            };
        default:
            return state;
    }
}

export const saveSettingsAction = (settings) => dispatch => {
    writeToLocalStorage("settings", settings);
};

export const getSavedSettingsAction = () => dispatch => {
    let settings = readFromLocalStorage("settings");
    if (settings === null) {
        settings = {
            bootstrap_nodes_count: 5,
            is_check_remember_me: false,
            is_remote_node_ssl: false,
            is_simulate_app: false,
            is_store_remembered_passphrase: false,
            is_testnet: false,
            remote_node_address: "",
            remote_node_port: 7876,
            validators_count: 3,
        };
    } else {
        settings = JSON.parse(settings);
    }

    dispatch({
        type: LOAD_SETTINGS,
        settings
    })
};
