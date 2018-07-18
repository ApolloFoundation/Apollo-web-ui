import  axios from "axios/index";
import config from "../../config";
import { login, startLoad, endLoad } from '../../modules/account';
import { writeToLocalStorage, readFromLocalStorage } from "../localStorage";

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