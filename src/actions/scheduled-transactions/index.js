import config from '../../config'
import store from '../../store'
import axios from 'axios';
import submitForm from '../../helpers/forms/forms'
import queryString from "query-string";

export const getScheduledTransactions = async (reqParams) => {
    return store.dispatch(await submitForm.submitForm(reqParams, 'getScheduledTransactions'))
}

export const deleteScheduledTransactionAction = ({adminPassword, transaction }) => () => 
    axios
        .post(config.api.serverUrl + queryString.stringify({
            requestType: 'deleteScheduledTransaction',
            adminPassword,
            transaction,
        }))
        .then(res => res.data);