import {NotificationManager} from 'react-notifications';
import {
    setBodyModalParamsAction, 
    setModalData, 
    saveSendModalState, 
    IS_MODAL_PROCESSING
} from '../../../../modules/modals';
import submitForm from '../../../../helpers/forms/forms';

export const handleFormSubmit = (values) => {
    return async dispatch => {

        dispatch({
            type: IS_MODAL_PROCESSING,
            payload: true
        })
    
        const res = await dispatch(submitForm.submitForm(values, 'dgsListing'));
    
        if (res.errorCode) {
            dispatch({
                type: IS_MODAL_PROCESSING,
                payload: false
            })

            NotificationManager.error(res.errorDescription, 'Error', 5000)
        } else {
            dispatch({
                type: IS_MODAL_PROCESSING,
                payload: false
            })

            dispatch(setBodyModalParamsAction(null, {}));
            NotificationManager.success('Product has been listed!', null, 5000);
        }
    }
};