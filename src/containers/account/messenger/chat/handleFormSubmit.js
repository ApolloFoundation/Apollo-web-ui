import {NotificationManager} from 'react-notifications';
import submitForm from '../../../../helpers/forms/forms';

export const handleSendMessageFormSubmit = ({ recipient, resetForm, messageToEncrypt, message, ...values }) => {
    return async (dispatch) => {
        console.log(recipient, resetForm, messageToEncrypt, message, values)
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

        let data = {};

        if (values.messageToEncrypt) {
            data = {
                ...values,
                messageToEncrypt: message,
            };
        }
    
        const secretPhrase = JSON.parse(JSON.stringify(values.secretPhrase));
    
        const res = await dispatch(submitForm.submitForm({
            ...data,
            recipient,
            secretPhrase,
            feeATM: 4
        }, 'sendMessage'));
    
        if (res && res.errorCode) {
            NotificationManager.error(res.errorDescription, 'Error', 5000);
        } else if (res &&  !res.errorCode) {
            resetForm();
            NotificationManager.success('Message has been submitted!', null, 5000);
        }
    }
};