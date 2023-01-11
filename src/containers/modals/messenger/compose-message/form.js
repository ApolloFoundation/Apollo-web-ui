import React from 'react';
import AccountRSFormInput from '../../../components/form-components/AccountRS'
import CustomTextArea from '../../../components/form-components/TextArea/TextAreaWithFormik'
import CheckboxFormInput from '../../../components/check-button-input';

const ComposeMessageForm = () => (
    <>
        <AccountRSFormInput
            label='Recipient'
            name='recipient'
        />
        <CustomTextArea
            label='Message'
            name='message'
            placeholder='Message'
        />
        <CheckboxFormInput
            name='messageToEncrypt'
            label='Encrypt Message'
            id="messageToEncryptCheckbox"
        />
    </>
)

export default ComposeMessageForm;