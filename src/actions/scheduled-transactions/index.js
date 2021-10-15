import store from '../../store'
import submitForm from '../../helpers/forms/forms'

export const getScheduledTransactions = async (reqParams) => {
    return store.dispatch(await submitForm.submitForm(reqParams, 'getScheduledTransactions'))
}