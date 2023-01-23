import {NotificationManager} from 'react-notifications';
import submitForm from '../../../../helpers/forms/forms';

export const handleSendMessageFormSubmit = ({
    recipient, resetForm, messageToEncrypt, message, textareaCount, ...values
}) => {
    return async (dispatch) => {
        console.log("🚀 ~ file: handleFormSubmit.js:7 ~ values", values)
        if (!message || message.length === 0 || !(/\S/.test(message))) {
            NotificationManager.error('Please write your message.', 'Error', 5000);
            return;
        }

        if (message.length > 100) {
            NotificationManager.error('Message must not exceed 100 characters.', 'Error', 5000);
            return;
        }

        if (!values.secretPhrase) {
            NotificationManager.error('Enter secret phrase.', 'Error', 5000);
            return;
        }

        let data = { ...values };

        if (messageToEncrypt) {
            data.messageToEncrypt = message;
        } else {
            data.message = message;
        }
    
        const res = await dispatch(submitForm.submitForm({
            ...data,
            recipient,
            feeATM: 4,
        }, 'sendMessage'));
    
        if (res && res.errorCode) {
            NotificationManager.error(res.errorDescription, 'Error', 5000);
        } else if (res &&  !res.errorCode) {
            resetForm();
            NotificationManager.success('Message has been submitted!', null, 5000);
        }
    }
};