import {NotificationManager} from "react-notifications";
import {
    setBodyModalParamsAction, 
    IS_MODAL_PROCESSING
} from '../../../../modules/modals';
import submitForm from '../../../../helpers/forms/forms';

export const handleFormSubmit = ({decimals = 0, ...rest}) => {
    return async dispatch => {
        const values = {
            ...rest,
            units: values.units * Math.pow(10, decimals)
        };

        dispatch({
            type: IS_MODAL_PROCESSING,
            payload: true
        });
    
        const res = await dispatch(submitForm.submitForm( values, 'transferCurrency'));
        if (res && res.errorCode) {
            dispatch({
                type: IS_MODAL_PROCESSING,
                payload: false
            });

            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            dispatch({
                type: IS_MODAL_PROCESSING,
                payload: false
            });
            dispatch(setBodyModalParamsAction());
            NotificationManager.success('Transfer currency request has been submitted!', null, 5000);
        }
    }
};