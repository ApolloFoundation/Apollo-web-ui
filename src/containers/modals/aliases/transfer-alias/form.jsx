import React from 'react';
import { useFormikContext } from 'formik';
import TextualInputComponent from '../../../components/form-components/TextualInput';
import AccountRSFormInput from '../../../components/form-components/AccountRS';
import CheckboxFormInput from '../../../components/check-button-input';
import CustomTextArea from '../../../components/form-components/TextArea';

const TransferAlias = ({ alias }) => {
    const { values } = useFormikContext();
    return (
        <>
            <TextualInputComponent 
                label='Alias'
                text={alias ? alias.aliasName : ''}
            />
            <AccountRSFormInput name='recipient' label='Recipient' />
            <CheckboxFormInput
                label='Add a message?'
                name='add_message'
                id="add_message-transfer-alias"
            />
            {
                values.add_message &&
                <>
                    <CustomTextArea
                        label='Message'
                        name='message'
                        placeholder='Message'
                    />

                    <CheckboxFormInput
                        label='Encrypt Message'
                        name='encrypt_message'
                        id="encrypt_message-transfer"
                    />
                    <CheckboxFormInput
                        label='Message is Never Deleted'
                        name='permanent_message'
                    />
                </>
            }
        </>
    )
}

export default TransferAlias;