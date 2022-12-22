import React from 'react';
import AccountRSFormInput from '../../../components/form-components/account-rs1'
import CustomTextArea from '../../../components/form-components/text-area1'
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