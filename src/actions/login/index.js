/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import axios from "axios";
import {NotificationManager} from 'react-notifications';
import config from "config";
import crypto from "helpers/crypto/crypto";
import {INIT_TRANSACTION_TYPES} from 'helpers/transaction-types/transaction-types';
import {login, logout, loadConstants, startLoad, endLoad, loadBlockchainStatusAction, setLoginProblemAction, getForgingAction } from 'modules/account';
import {writeToLocalStorage, readFromLocalStorage, clearLocalStorage, deleteFromLocalStorage} from "actions/localStorage";
import {getTransactionsAction} from "actions/transactions";
import {updateStoreNotifications} from "modules/account";
import submitForm from "helpers/forms/forms";
import {setBodyModalParamsAction} from "modules/modals";
import {setAccountPassphrase} from 'modules/account';
import cancelAxiosRequest from 'helpers/cancelToken';
import { dashboardAccountInfoAction } from "modules/dashboard";
import store from '../../store'

export function getAccountDataAction(requestParams) {
    return async dispatch => {
        dispatch(setLoginProblemAction(false));
        const loginStatus = await dispatch(makeLoginReq(requestParams));

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

        dispatch(setAccountPassphrase(requestParams.secretPhrase));

        writeToLocalStorage('secretPhrase', requestParams.secretPhrase);

        const loginStatus = await dispatch(makeLoginReq({account: accountRS}));

        if (loginStatus) {
            if (loginStatus.errorCode && !loginStatus.account) {
                NotificationManager.error(loginStatus.errorDescription, 'Error', 5000)
            } else {
                let localContacts = readFromLocalStorage('APLContacts')

                let values = {
                    accountRS: loginStatus.accountRS,
                    name: loginStatus.accountRS
                };


                if (localContacts) {
                    localContacts = JSON.parse(localContacts);
                    const isInside = localContacts.find((el) => {
                        return el.accountRS === values.accountRS
                    });

                    if (isInside) {

                    } else {
                        localContacts.push(values);
                      writeToLocalStorage('APLContacts', localContacts);
                    }
                } else {
                  writeToLocalStorage('APLContacts',[values]);
                }

                // document.location = '/dashboard';
            }
        }
    };
}

export function isLoggedIn(history) {
    return dispatch => {
        let account = readFromLocalStorage('APLUserRS');

        if (account) {
            account = JSON.parse(account);
            dispatch(makeLoginReq({account}));
        } else {
            if (document.location.pathname !== '/login' && document.location.pathname !== '/faucet')
                history.push('/login');
        }
    };
}

export function getUpdateStatus() {
    return () => axios.get(config.api.serverUrl, {
        params: {
            requestType: 'getUpdateStatus',
        }
    })
        .then((res) => {
            if (res.data ) {
                if (!res.data.isUpdate) {
                    let flag = readFromLocalStorage('updateFlag');

                    if (!flag) {
                        NotificationManager.info('You are using up to date version', null, 900000);
                        writeToLocalStorage('updateFlag', true)
                    }
                }
                if (res.data.isUpdate) {
                    NotificationManager.error('Your current version is expired. New version is available: ' + res.data.level, 'Attention', 900000);
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
            if (res.data && (!res.data.errorCode || res.data.errorCode === 5)) {
                delete res.data.errorCode;
                delete res.data.errorDescription;
                dispatch(login(res.data));
            }
        })
        .catch(function (err) {
            dispatch(setLoginProblemAction(true));
        });
};

export const makeLoginReq = (requestParams) => (dispatch, getState) => {
    const {account: {accountRS}} = getState();
    if (accountRS && accountRS !== requestParams.account) {
        dispatch(startLoad());
        dispatch(logout());
    }
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
            if (res.data) {
                delete res.data.errorCode;
                delete res.data.errorDescription;
                const secret = readFromLocalStorage('secretPhrase');
                if (res.data.account) {
                    writeToLocalStorage('APLUserRS', res.data.accountRS);
                    dispatch(updateNotifications())(res.data.accountRS);

                    dispatch(getConstantsAction());

                    dispatch(setAccountPassphrase(secret && JSON.parse(secret)));
                    
                    dispatch(dashboardAccountInfoAction(res.data));

                    dispatch(login(res.data));

                    dispatch(getForging());

                    dispatch(endLoad());
                }
                return res.data;
            }
        })
        .catch(function (err) {
            dispatch(setLoginProblemAction(true));
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
                dispatch(getForgingAction(res.data));
                return res.data;
            })
    }
}

export function setForging(requestType) {
    return (dispatch, getState) => {
        const account = getState().account;
        const secretString = readFromLocalStorage('secretPhrase')
        const passpPhrase = secretString ? JSON.parse(secretString) : account.passPhrase;
        const forgingStatus = dispatch(crypto.validatePassphrase(passpPhrase));

        return Promise.resolve(forgingStatus)
            .then((isPassphrase) => {
                dispatch(setAccountPassphrase(passpPhrase));

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

    // cancel request from getDashboardData if it was trigger before we logout
    cancelAxiosRequest.cancelRequests();

    switch (action) {
        case('simpleLogOut'):
            deleteFromLocalStorage('APLUserRS');
            deleteFromLocalStorage('secretPhrase');
            deleteFromLocalStorage('wallets');
            dispatch(logout());
            dispatch(setAccountPassphrase(null));

            history.push('/login');
            return;
        case('logOutStopForging'):
            const handleLogout = () => {
                deleteFromLocalStorage('APLUserRS');
                deleteFromLocalStorage('secretPhrase');
                deleteFromLocalStorage('wallets');
                dispatch(logout());

                history.push('/login');
            };

            deleteFromLocalStorage('wallets');
            const {account} = store.getState();
            const secret = readFromLocalStorage('secretPhrase');
            const passPhrase = secret ? JSON.parse(secret) : account.passPhrase;
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
            clearLocalStorage();
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
                dispatch(setLoginProblemAction(true))
            });
    };
}

export function loadBlockchainStatus() {
    return (dispatch) => {
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getBlockchainStatus'
            }
        })
            .then((res) => {
                if (!res.data.errorCode) {
                    dispatch(loadBlockchainStatusAction(res.data));
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

