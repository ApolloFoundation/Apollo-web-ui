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

export const processForm = async (values, requestType, successMesage, successCallback, errorCallback) => {
    dispatch({
        type: IS_MODAL_PROCESSING,
        payload: true
    });

    const res = await dispatch(submitForm.submitForm(values, requestType));

    if (res) {
        if (res.errorCode) {
            dispatch({
                type: IS_MODAL_PROCESSING,
                payload: false
            });

            if (errorCallback) {
                errorCallback(res);
            } else {
                NotificationManager.error(res.errorDescription, 'Error', 5000)
            }
        } else {
            dispatch({
                type: IS_MODAL_PROCESSING,
                payload: false
            });

            if (successCallback) {
                successCallback(res)
            }
        }
    } else {
        dispatch({
            type: IS_MODAL_PROCESSING,
            payload: false
        });

        if (errorCallback) {
            errorCallback(res);
        }
    }
};