import {NotificationManager} from 'react-notifications';
import submitForm from '../../../../helpers/forms/forms';

export const handleSendMessageFormSubmit = (values, formApi) => {
    return async (dispatch, getState) => {
        const {account: {account, puplicKey}} = getState();
        const {recipient, resetForm} = values;

        delete values.resetForm;

        if (!values.message || values.message.length === 0 || !(/\S/.test(values.message))) {
            NotificationManager.error('Please write your message.', 'Error', 5000);
            return;
        }

        if (values.message.length > 100) {
            NotificationManager.error('Message must not exceed 100 characters.', 'Error', 5000);
            return;
        }

        if (values.messageToEncrypt) {
            values = {
                ...values,
                messageToEncrypt: values.message,
                // message: null
            };
            delete values.message;
        }
    
        if (!values.secretPhrase) {
            NotificationManager.error('Enter secret phrase.', 'Error', 5000);
            return;
        }
    
        const secretPhrase = JSON.parse(JSON.stringify(values.secretPhrase));
        // delete values.secretPhrase;
    
        const res = await dispatch(submitForm.submitForm({
            ...values,
            recipient,
            secretPhrase,
            feeATM: 4
        }, 'sendMessage'));
    
        if (res && res.errorCode === 4) {
            NotificationManager.error('Message must not exceed 100 characters.', 'Error', 5000);
            return;
        }
        if (res && res.errorCode === 6) {
            NotificationManager.error('Incorrect secret phrase.', 'Error', 5000);
            return;
        }
        if (res &&  !res.errorCode) {
            formApi.resetAll()
            resetForm()
            NotificationManager.success('Message has been submitted!', null, 5000);
        }
    }
};