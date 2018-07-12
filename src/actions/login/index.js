import  axios from "axios/index";
import config from "../../config";
import { login } from '../../modules/account';
import { writeToLocalStorage, readFromLocalStorage } from "../localStorage";

export function getAccountDataAction(requestParams) {
    return dispatch => {
        makeLoginReq(dispatch, requestParams);
    };
}

export function isLoggedIn() {
    return dispatch => {
        let account = JSON.parse(readFromLocalStorage('APLUserRS'));

        console.log(account);

        makeLoginReq(dispatch, {
            account: account
        });
    };
}

function makeLoginReq(dispatch, requestParams) {
    return axios.get(config.api.serverUrl, {
        params: {
            requestType: 'getAccount',
            ...requestParams
        }
    })
        .then((res) => {
            console.log(res.data);
            if (!res.data.errorCode) {
                writeToLocalStorage('APLUserRS', res.data.accountRS);
                dispatch(login(res.data));
                // document.location.href = '/dashboard';
                return;
            }
            console.log('err: ',res.data.errorCode);
        })
        .catch(function(err){
            console.log(err)
        });
}