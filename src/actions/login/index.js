import  axios from "axios/index";
import config from "../../config";
import { login, loadConstants, startLoad, endLoad } from '../../modules/account';
import { writeToLocalStorage, readFromLocalStorage } from "../localStorage";
import crypto from "../../helpers/crypto/crypto";

export function getAccountDataAction(requestParams) {
    return dispatch => {
        makeLoginReq(dispatch, requestParams)
            .then(() => {
                document.location.href = '/dashboard';
            })
    };
}

export function isLoggedIn() {
    return dispatch => {
        let account = JSON.parse(readFromLocalStorage('APLUserRS'));

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
            if (!res.data.errorCode) {
                dispatch(endLoad());
                writeToLocalStorage('APLUserRS', res.data.accountRS);
                dispatch(login(res.data));
            } else {
                document.location = '/login';
            }
        })
        .catch(function(err){
            console.log(err)
        });
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
                    dispatch(crypto.validatePassphrase('test1'));
                    dispatch(crypto.validatePassphrase('test2'));
                } else {
                }
            })
            .catch(function(err){
                console.log(err)
            });
    };
}

