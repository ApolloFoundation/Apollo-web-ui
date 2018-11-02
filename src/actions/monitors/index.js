import config from '../../config'
import store from '../../store'
import axios from 'axios';
import submitForm from '../../helpers/forms/forms'

export const getFundingMonitorsAction = (requestParams) => {

    return axios.get(config.api.serverUrl, {
        params : {
            requestType: 'getFundingMonitor',
            ...requestParams
        }
    })
        .then((data) => {
            return data.data;
        })
}

export const startMonitor = async (reqParams) => {
    return store.dispatch(await submitForm.submitForm(reqParams, 'startFundingMonitor'))
}

export const stopMonitor = async (reqParams) => {
    return store.dispatch(await submitForm.submitForm(reqParams, 'stopFundingMonitor'))
}