import config from '../../config'
import store from '../../store'
import axios from 'axios';
import submitForm from '../../helpers/forms/forms'
import {processElGamalEncryption} from "../crypto";

export const getFundingMonitorsAction = (requestParams) => {
    return async () => {
        let data = requestParams;
        if (data.passphrase) data.passphrase = await processElGamalEncryption(data.passphrase);
        else if (data.secretPhrase) data.secretPhrase = await processElGamalEncryption(data.secretPhrase);
        return axios.get(config.api.serverUrl, {
            params: {
                requestType: 'getFundingMonitor',
                ...data
            }
        })
            .then((data) => {
                return data.data;
            })
    }
};

export const startMonitor = (reqParams) => async (dispatch) => {
    let data = reqParams;
    if (data.passphrase) data.passphrase = await processElGamalEncryption(data.passphrase);
    else if (data.secretPhrase) data.secretPhrase = await processElGamalEncryption(data.secretPhrase);
    return dispatch(await submitForm.submitForm(data, 'startFundingMonitor'))
}

export const stopMonitorThunk = (reqParams) => async (dispatch) => {
    let data = reqParams;
    if (data.passphrase) data.passphrase = await processElGamalEncryption(data.passphrase);
    else if (data.secretPhrase) data.secretPhrase = await processElGamalEncryption(data.secretPhrase);
    return dispatch(await submitForm.submitForm(data, 'stopFundingMonitor'))
}