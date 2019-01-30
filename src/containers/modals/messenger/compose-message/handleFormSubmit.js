import {NotificationManager} from "react-notifications";

import {
    setBodyModalParamsAction, 
    IS_MODAL_PROCESSING
} from '../../../../modules/modals';

import submitForm from '../../../../helpers/forms/forms';

export const handleFormSubmit = (values) => {
    return async dispatch => {
        if (values.messageToEncrypt) {
            values.messageToEncrypt = values.message;
            delete values.message;
        }

        dispatch({
            type: IS_MODAL_PROCESSING,
            payload: true
        });

        // Todo: finish form validating
        const res = await dispatch(submitForm.submitForm( values, 'sendMessage'));
        if (res.errorCode) {
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

            dispatch(setBodyModalParamsAction(null, {}));
            NotificationManager.success('Message has been submitted!', null, 5000);
        }
    }
};