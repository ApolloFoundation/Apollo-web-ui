import React from 'react';
import TextualInputComponent from 'containers/components/form-components/TextualInput';
import AccountRSFormInput from 'containers/components/form-components/AccountRS';
import { MessageInputs } from 'containers/components/form-components/MessageInputs';

const TransferAlias = ({ alias }) => (
    <>
        <TextualInputComponent 
            label='Alias'
            text={alias ? alias.aliasName : ''}
        />
        <AccountRSFormInput name='recipient' label='Recipient' />
        <MessageInputs idGroup="add_message-transfer-alias" />
    </>
);

export default TransferAlias;