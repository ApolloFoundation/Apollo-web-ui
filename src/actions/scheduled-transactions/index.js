import config from '../../config'
import store from '../../store'
import axios from 'axios';
import submitForm from '../../helpers/forms/forms'

export const getScheduledTransactions = async (reqParams) => {
    return store.dispatch(await submitForm.submitForm(reqParams, 'getScheduledTransactions'))
}

export const deleteScheduledTransactionAction = ({adminPassword, tranasction }) => () => 
    axios.post(config.api.serverUrl, {
        requestType: 'deleteScheduledTransaction',
        adminPassword,
        tranasction,
    });