/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

import submitForm from '../../helpers/forms/forms';
import store from '../../store';
import {
    setBodyModalParamsAction, 
    IS_MODAL_PROCESSING
} from '../../modules/modals';
import {NotificationManager} from "react-notifications";

const {dispatch} = store;


export const calculateFeeAction = (requestParams, requestType) => {
    return dispatch(submitForm.submitForm(requestParams, requestType))
}

export const processForm = (values, requestType, successMesage, successCallback) => {
    return async dispatch => {

        dispatch({
            type: IS_MODAL_PROCESSING,
            payload: true
        });

        const res = await dispatch(submitForm.submitForm(values, requestType));
    
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

            if (successCallback) {
                successCallback()
            }

            dispatch(setBodyModalParamsAction(null, {}));
            NotificationManager.success(successMesage, null, 5000);
        }
    }
}