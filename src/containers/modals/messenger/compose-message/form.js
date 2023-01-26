import React from 'react';
import AccountRSFormInput from 'containers/components/form-components/AccountRS'
import CustomTextArea from 'containers/components/form-components/TextArea/TextAreaWithFormik'
import CheckboxFormInput from 'containers/components/check-button-input/CheckboxWithFormik';

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