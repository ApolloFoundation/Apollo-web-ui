import {NotificationManager} from "react-notifications";

import {
    setBodyModalParamsAction, 
    IS_MODAL_PROCESSING
} from '../../../../modules/modals';

import submitForm from '../../../../helpers/forms/forms';

export const handleFormSubmit = (values) => {
    return async dispatch => {

        values = {
            ...values,
            registrationPeriod: 1439
        };

        
        dispatch({
            type: IS_MODAL_PROCESSING,
            payload: true
        })
        const res = await dispatch(submitForm.submitForm( values, 'shufflingCreate'));
        if (res && res.errorCode) {
            dispatch({
                type: IS_MODAL_PROCESSING,
                payload: false
            })

            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {

            NotificationManager.success('Shuffling Created!', null, 5000);
            const broadcast = await dispatch(submitForm.submitForm( {
                    transactionBytes: res.transactionBytes || res.unsignedTransactionBytes,
                    prunableAttachmentJSON: JSON.stringify({...(res.transactionJSON.attachment), "version.ShufflingCreation": 1}),
                    createNoneTransactionMethod: true
                }, 'broadcastTransaction'));

            if (broadcast && broadcast.errorCode) {
                dispatch({
                    type: IS_MODAL_PROCESSING,
                    payload: false
                });

                NotificationManager.error(broadcast.errorDescription, 'Error', 5000)
            } else {
                dispatch({
                    type: IS_MODAL_PROCESSING,
                    payload: false
                });

                dispatch(setBodyModalParamsAction('START_SHUFFLING', {broadcast}));
            }
        }
    }
};