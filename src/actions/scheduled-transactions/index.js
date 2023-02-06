import axios from 'axios';
import queryString from "query-string";
import config from 'config'
import submitForm from 'helpers/forms/forms'

export const getScheduledTransactionsThunk = (reqParams) => (dispatch) => 
    dispatch(submitForm.submitForm(reqParams, 'getScheduledTransactions'))

export const deleteScheduledTransactionAction = ({adminPassword, transaction }) => () => 
    axios
        .post(config.api.serverUrl + queryString.stringify({
            requestType: 'deleteScheduledTransaction',
            adminPassword,
            transaction,
        }))
        .then(res => res.data);