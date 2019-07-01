import {NotificationManager} from "react-notifications";

import {
    setBodyModalParamsAction, 
    IS_MODAL_PROCESSING
} from '../../../../modules/modals';

import submitForm from '../../../../helpers/forms/forms';

export const handleFormSubmit = function (values) {
    
    const {store : {dispatch}} = this;

    if (!values.recipient) {
        NotificationManager.error('Recipient is required.', 'Error', 5000);
        return;
    }

    if (values.messageToEncrypt) {
        values.messageToEncrypt = values.message;
        delete values.message;
    }

    dispatch({
        type: IS_MODAL_PROCESSING,
        payload: true
    });

    // Todo: finish form validating
    this.processForm(values, 'sendMessage', 'Message has been submitted', () => {
        dispatch({
            type: IS_MODAL_PROCESSING,
            payload: false
        });

        dispatch(setBodyModalParamsAction(null, {}));
        NotificationManager.success('Message has been submitted!', null, 5000);
    })
};