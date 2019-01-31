import {NotificationManager} from 'react-notifications';

export const handleSendMessageFormSubmit = (values) => {
    return async dispatch => {
        if (!values.message || values.message.length === 0 || !(/\S/.test(values.message))) {
            NotificationManager.error('Please write your message.', 'Error', 5000);
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
    
    
        const res = await this.props.submitForm( {
            ...values,
            recipient: this.props.match.params.chat,
            secretPhrase: secretPhrase,
            feeATM: 4
        }, 'sendMessage');
    
        if (res.errorCode === 4) {
            NotificationManager.error('Message length should not be grater than 100 symbols.', 'Error', 5000);
            return;
        }
        if (res.errorCode === 6) {
            NotificationManager.error('Incorrect secret phrase.', 'Error', 5000);
            return;
        }
        if (!res.errorCode) {
            NotificationManager.success('Message has been submitted!', null, 5000);
            this.setState({textareaCount : 0})
            if (this.state.formApi) {
                this.state.formApi.setValue('message', null);
                this.state.formApi.setValue('secretPhrase', null);
                this.state.formApi.setValue('code2FA', null);
            }
        }
    }
};