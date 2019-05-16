/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import axios from "axios/index";
import config from "../../config";
import crypto from "../../helpers/crypto/crypto";
import {NotificationManager} from 'react-notifications';
import {processElGamalEncryption} from '../../actions/crypto';


import {INIT_TRANSACTION_TYPES} from '../../helpers/transaction-types/transaction-types';
import {login, logout, loadConstants, startLoad, endLoad, LOAD_BLOCKCHAIN_STATUS, SET_PASSPHRASE} from '../../modules/account';
import {writeToLocalStorage, readFromLocalStorage} from "../localStorage";
import {getTransactionsAction} from "../transactions";
import {updateStoreNotifications} from "../../modules/account";
import submitForm from "../../helpers/forms/forms";
import store from '../../store'
import {setBodyModalParamsAction} from "../../modules/modals";
import {setAccountPassphrase} from '../../modules/account';

export function getAccountDataAction(requestParams) {
    return async dispatch => {
        dispatch({
            type: 'SET_LOGIN_PROBLEM',
            payload: false
        });
        const loginStatus = (await dispatch(makeLoginReq(requestParams)));

        if (loginStatus) {
            if (loginStatus.errorCode && !loginStatus.account) {
                NotificationManager.error(loginStatus.errorDescription, 'Error', 5000)
            }
        }
    };
}

export function getAccountDataBySecretPhrasseAction(requestParams) {
    return async dispatch => {

        const accountRS = await (dispatch(crypto.getAccountIdAsyncApl(requestParams.secretPhrase)));

        dispatch({
            type: 'SET_PASSPHRASE',
            payload: requestParams.secretPhrase
        });

        localStorage.setItem('secretPhrase', JSON.stringify(requestParams.secretPhrase));

        const loginStatus = await dispatch(makeLoginReq({account: dispatch(accountRS)}));

        if (loginStatus) {
            if (loginStatus.errorCode && !loginStatus.account) {
                NotificationManager.error(loginStatus.errorDescription, 'Error', 5000)
            } else {
                let localContacts = localStorage.getItem('APLContacts');

                let values = {
                    accountRS: loginStatus.accountRS,
                    name: loginStatus.accountRS
                };

                localContacts = JSON.parse(localContacts);

                if (localContacts) {
                    const isInside = localContacts.find((el) => {
                        return el.accountRS === values.accountRS
                    });

                    if (isInside) {

                    } else {
                        localContacts.push(values);
                        localStorage.setItem('APLContacts', JSON.stringify(localContacts));
                    }
                } else {
                    localStorage.setItem('APLContacts', JSON.stringify([values]));
                }

                // document.location = '/dashboard';
            }
        }
    };
}

export function isLoggedIn(history) {
    return dispatch => {
        let account = JSON.parse(readFromLocalStorage('APLUserRS'));

        if (account) {
            dispatch(makeLoginReq({account}));
        } else {
            if (document.location.pathname !== '/login')
                history.push('/login');
        }
    };
}

export function getUpdateStatus() {
    return axios.get(config.api.serverUrl, {
        params: {
            requestType: 'getUpdateStatus',
        }
    })
        .then((res) => {
            if (res.data ) {
                if (!res.data.isUpdate) {
                    let flag = localStorage.getItem('updateFlag');

                    if (!flag) {
                        NotificationManager.info('You are using up to date version', null, 900000);
                        localStorage.setItem('updateFlag', true)
                    }
                }
                if (res.data.isUpdate) {
                    NotificationManager.error('You current version is expired. Available new version: ' + res.data.level, 'Attention', 900000);
                }
            }
        })
}

export const reloadAccountAction = acc => dispatch => {
    dispatch(updateAccount({account: acc}));
};

export const updateAccount = (requestParams) => dispatch => {
    return axios.get(config.api.serverUrl, {
        params: {
            requestType: 'getAccount',
            includeAssets: true,
            includeCurrencies: true,
            includeLessors: true,
            ...requestParams
        }
    })
        .then((res) => {
            dispatch(login(res.data));
        })
        .catch(function (err) {
            dispatch({
                type: 'SET_LOGIN_PROBLEM',
                payload: true
            })
        });
}

export const makeLoginReq = (requestParams) => (dispatch) => {
    dispatch(startLoad());
    return axios.get(config.api.serverUrl, {
        params: {
            requestType: 'getAccount',
            includeAssets: true,
            includeCurrencies: true,
            includeLessors: true,
            ...requestParams
        }
    })
        .then((res) => {
            if (res.data.account) {
                writeToLocalStorage('APLUserRS', res.data.accountRS);
                dispatch(updateNotifications())(res.data.accountRS);
                dispatch(getConstantsAction());
                dispatch({
                    type: 'SET_PASSPHRASE',
                    payload: JSON.parse(localStorage.getItem('secretPhrase'))
                });
                dispatch({
                    type: 'SET_DASHBOARD_ACCOUNT_INFO',
                    payload: res.data
                });
                dispatch(login(res.data));
                dispatch(getForging());
                dispatch(endLoad());
            }
            return res.data;
        })
        .catch(function (err) {
            dispatch({
                type: 'SET_LOGIN_PROBLEM',
                payload: true
            })
        });
}

export function getForging() {
    return (dispatch, getState) => {
        const account = getState().account;

        const requestParams = {
            requestType: 'getForging',
            account: account.account,
            publicKey: account.publicKey,
        };

        return axios.get(config.api.serverUrl, {
            params: requestParams
        })
            .then((res) => {
                dispatch({
                    type: 'GET_FORGING',
                    payload: res.data
                });
                return res.data;
            })
    }
}

export function setForging(requestType) {
    return (dispatch, getState) => {
        const account = getState().account;
        const passpPhrase = JSON.parse(localStorage.getItem('secretPhrase')) || account.passPhrase;
        // dispatch({
        //     type: 'SET_PASSPHRASE',
        //     payload: passpPhrase
        // });

        const forgingStatus = dispatch(crypto.validatePassphrase(passpPhrase));

        return Promise.resolve(forgingStatus)
            .then((isPassphrase) => {
                dispatch({
                    type: 'SET_PASSPHRASE',
                    payload: passpPhrase
                });

                var requestParams;
                if (isPassphrase) {
                    requestParams = {
                        ...requestType,
                        secretPhrase: passpPhrase
                    };
                } else {
                    requestParams = {
                        ...requestType,
                        passphrase: passpPhrase,
                        account: account.account
                    };
                }

                return dispatch(submitForm.submitForm(requestParams, requestType.requestType));
            })

    }
}

export async function logOutAction(action, history) {
    const {dispatch} = store;

    switch (action) {
        case('simpleLogOut'):
            localStorage.removeItem("APLUserRS");
            localStorage.removeItem("secretPhrase");
            localStorage.removeItem("wallets");
            dispatch(logout());
            dispatch(setAccountPassphrase(null));
            
            history.push('/login');
            return;
        case('logOutStopForging'):
            const handleLogout = () => {
                localStorage.removeItem("APLUserRS");
                localStorage.removeItem("secretPhrase");
                localStorage.removeItem("wallets");
                dispatch(logout());

                history.push('/login');
            };

            localStorage.removeItem("wallets");
            const {account} = store.getState();
            const passPhrase = JSON.parse(localStorage.getItem('secretPhrase')) || account.passPhrase;
            if (account.forgingStatus && !account.forgingStatus.errorCode && (!passPhrase || account.is2FA)) {
                store.dispatch(setBodyModalParamsAction('CONFIRM_FORGING', {
                    getStatus: 'stopForging',
                    handleSuccess: () => handleLogout()
                }));
                return;
            }

            const forging = await store.dispatch(setForging({requestType: 'stopForging'}));

            if (!account.effectiveBalanceAPL || account.effectiveBalanceAPL < 1000) {
                handleLogout();
                return;
            }

            if (forging.errorCode === 22 || forging.errorCode === 4 || forging.errorCode === 8 || forging.errorCode === 3) {
                store.dispatch(setBodyModalParamsAction('CONFIRM_FORGING', {
                    getStatus: 'stopForging',
                    handleSuccess: () => handleLogout()
                }));
            }
            
            if (!forging.errorCode){
                if (forging) {
                    handleLogout();
                }
                return;
            }
            return;
        case('logoutClearUserData'):
            localStorage.clear();
            dispatch(setAccountPassphrase(null))
            dispatch(logout());

            history.push('/login');            
            return;
        default:
            return;
    }
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
            .catch(function (err) {
                dispatch({
                    type: 'SET_LOGIN_PROBLEM',
                    payload: true
                })
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
                    dispatch({
                        type: "LOAD_BLOCKCHAIN_STATUS",
                        payload: res.data
                    });
                    return res.data;
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }
}

export function getTime() {
    return dispatch => {
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getTime'
            }
        })
            .then((res) => {
                return res.data
            })
    }
}

export function updateNotifications() {
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
                    Object.values(notifications).map(function (typeDict, typeIndex) {
                        typeDict["notificationCount"] = 0;
                        Object.values(typeDict["subTypes"]).map(function (subTypeDict, subTypeIndex) {
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
                        for (var i = 0; i < transactions.transactions.length; i++) {
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

