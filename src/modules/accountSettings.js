/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import {readFromLocalStorage, writeToLocalStorage} from "../actions/localStorage";

export const LOAD_ACCOUNT_SETTINGS = "LOAD_ACCOUNT_SETTINGS";

const initState = {
    language: "en",
    regFormat: "",
    use24h: true,
    maxDecimals: 2,
    enablePlugins: false,
    showConsoleButton: false,
    adminPass: "",

    submitFormsEnter: false,
    marketplaceSelection: false,
    exchangeSection: false,
    animateForging: true,
    itemsToShow: 15,

    maxAmountWarn: 100000,
    maxFeeWarn: 1,
    maxAssetWarn: 10000,
    maxCurrencyWarn: 10000,
    showFakeWarns: true,

    header: "default",
    sidebar: "default",
    boxes: "default",
};

export default (state = initState, action) => {
    switch (action.type) {
        case LOAD_ACCOUNT_SETTINGS:
            return {
                ...state,
                ...action.settings
            };
        default:
            return state;
    }
}

export const saveAccountSettingsAction = (settings) => {
    writeToLocalStorage("accountSettings", settings);
};

export const getSavedAccountSettingsAction = () => dispatch => {
    let settings = JSON.parse(readFromLocalStorage("accountSettings"));
    if (settings === null) {
        settings = {
            language: "en",
            regFormat: "",
            use24h: true,
            maxDecimals: 2,
            enablePlugins: true,
            showConsoleButton: false,
            adminPass: "",

            submitFormsEnter: false,
            marketplaceSelection: true,
            exchangeSection: true,
            animateForging: true,
            itemsToShow: 15,

            maxAmountWarn: 100000,
            maxFeeWarn: 1,
            maxAssetWarn: 10000,
            maxCurrencyWarn: 10000,
            showFakeWarns: true,

            header: "#F5F5F5",
            sidebar: "#F5F5F5",
            boxes: "#F5F5F5",
        };
    }
    dispatch({
        type: LOAD_ACCOUNT_SETTINGS,
        settings
    })
};
