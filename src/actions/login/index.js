import  axios from "axios/index";
import config from "../../config";
import crypto from "../../helpers/crypto/crypto";
import {NotificationManager} from 'react-notifications';

import {INIT_TRANSACTION_TYPES} from '../../helpers/transaction-types/transaction-types';
import {login, loadConstants, startLoad, endLoad, LOAD_BLOCKCHAIN_STATUS, SET_PASSPHRASE} from '../../modules/account';
import { writeToLocalStorage, readFromLocalStorage, deleteFromLocalStorage } from "../localStorage";
import {getTransactionsAction} from "../transactions";
import {updateStoreNotifications} from "../../modules/account";

export function getAccountDataAction(requestParams) {
    return async dispatch => {
        const loginStatus = (await makeLoginReq(dispatch, requestParams));

        console.log(loginStatus);


        if (loginStatus.errorCode && !loginStatus.account) {
            NotificationManager.error(loginStatus.errorDescription, 'Error', 5000)
        } else {
            console.log(2);
            document.location = '/dashboard';
        }
    };
}

export function getAccountDataBySecretPhrasseAction(requestParams) {
    return async dispatch => {

        console.log(requestParams);
        const accountRS = await (dispatch(crypto.getAccountIdAsync(requestParams.secretPhrase)));
        
        dispatch({
            type: 'SET_PASSPHRASE',
            payload: requestParams.secretPhrase
        });

        const loginStatus = (await makeLoginReq(dispatch, {account: dispatch(accountRS)}));

        console.log(loginStatus);

        if (loginStatus.errorCode && !loginStatus.account) {
            NotificationManager.error(loginStatus.errorDescription, 'Error', 5000)
        } else {
            document.location = '/dashboard';
        }
    };
}



export function isLoggedIn() {
    return dispatch => {
        let account = JSON.parse(readFromLocalStorage('APLUserRS'));

        console.log(account);

        if (account) {
            makeLoginReq(dispatch, {
                account: account
            });
        } else {
            if (document.location.pathname !== '/login')
                document.location.href = '/login';
        }
    };
}

function makeLoginReq(dispatch, requestParams) {
    dispatch(startLoad());
    console.log(requestParams);
    return axios.get(config.api.serverUrl, {
        params: {
            requestType: 'getAccount',
            includeAssets: true,
            includeCurrencies: true,
            includeLessors: true,
            includeEffectiveBalance: true,
            ...requestParams
        }
    })
        .then((res) => {
            console.log(res.data);
            if (res.data.account) {
                dispatch(endLoad());
                writeToLocalStorage('APLUserRS', res.data.accountRS);
                dispatch(updateNotifications())(res.data.accountRS);

                dispatch(login(res.data));

                return res.data;
            } else {
                return res.data;
            }
        })
        .catch(function(err){
            console.log(err)
        });
}

export function logOutAction() {
    deleteFromLocalStorage('APLUserRS');
    document.location = '/';
}

export function getConstantsAction() {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getConstants',
            }
        })
            .then(async (res) => {
                if (!res.data.errorCode) {
                    await dispatch(loadConstants(res.data));
                    await dispatch(loadBlockchainStatus());
                } else {
                }
            })
            .catch(function(err){
                console.log(err)
            });
    };
}

export function loadBlockchainStatus() {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getBlockchainStatus'
            }
        })
            .then((res) => {
                if (!res.data.errorCode) {
                    console.log(res.data);
                    dispatch({
                        type: "LOAD_BLOCKCHAIN_STATUS",
                        payload: res.data
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }
}

export function getTime () {
    return dispatch => {
        return axios.get(config.api.serverUrl,{
            params: {
                requestType: 'getTime'
            }
        })
            .then((res) => {
                return res.data
            })
    }
}

export function updateNotifications () {
    return (dispatch, getState) => {
        return async (account) => {

            const time = await dispatch(getTime());

            var fromTS = Math.max(time.time - 60 * 60 * 24 * 14, 0);
            if (account) {
                const transactions = await dispatch(getTransactionsAction({
                    "account": account,
                    "timestamp": fromTS,
                    "firstIndex": 0,
                    "lastIndex": 99
                }));

                let notifications = INIT_TRANSACTION_TYPES;

                let tsDict = {};
                if (transactions) {
                    Object.values(notifications).map(function(typeDict, typeIndex) {
                        typeDict["notificationCount"] = 0;
                        Object.values(typeDict["subTypes"]).map(function(subTypeDict, subTypeIndex) {
                            var tsKey = "ts_" + String(typeIndex) + "_" + String(subTypeIndex);
                            if (tsDict[tsKey]) {
                                subTypeDict["notificationTS"] = tsDict[tsKey];
                            } else {
                                subTypeDict["notificationTS"] = time;
                            }
                            subTypeDict["notificationCount"] = 0;
                        });
                    });

                    if (transactions.transactions && transactions.transactions.length) {
                        for (var i=0; i<transactions.transactions.length; i++) {
                            var t = transactions.transactions[i];
                            var subTypeDict = notifications[t.type];
                            if (subTypeDict) {
                                subTypeDict = subTypeDict["subTypes"][t.subtype];
                                if (t.recipientRS && t.recipientRS === account && subTypeDict["receiverPage"]) {
                                    if (!subTypeDict["lastKnownTransaction"] || subTypeDict["lastKnownTransaction"].timestamp < t.timestamp) {
                                        subTypeDict["lastKnownTransaction"] = t;
                                    }

                                    if (t.timestamp < subTypeDict["notificationTS"].time) {
                                        notifications[t.type]["notificationCount"] += 1;
                                        subTypeDict["notificationCount"] += 1;
                                    }
                                }
                            }
                        }
                    }
                }

                dispatch(updateStoreNotifications(notifications))
            }
        }
    }
}

