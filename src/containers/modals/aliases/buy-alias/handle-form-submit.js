import submitForm  from "../../../../helpers/forms/forms";
import { NotificationManager } from "react-notifications";
import {setBodyModalParamsAction} from '../../../../modules/modals';


const handleFormSubmit = (values) => {
    return async (dispatch) => {

        const buyAlias = await dispatch(submitForm.submitForm(values, 'buyAlias'))

        if (buyAlias) {
            if (!buyAlias.errorCode) {
                NotificationManager.success('Buying of alias has been submitted!', null, 5000);
                dispatch(setBodyModalParamsAction())
            }
            else {
                NotificationManager.error(buyAlias.errorDescription, 'Error', 5000);
            }
        }
    }
}

export default handleFormSubmit;