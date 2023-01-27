import React from 'react';
import TextualInputComponent from 'containers/components/form-components/TextualInput';
import AccountRSFormInput from 'containers/components/form-components/AccountRS';
import NumericInputComponent from 'containers/components/form-components/NumericInput';
import { MessageInputs } from 'containers/components/form-components/MessageInputs';

export const SpecificForm = ({ alias, ticker }) => {
  return (
    <>
      {
        alias &&
        <TextualInputComponent
            label='Alias'
            text={alias.aliasName}
        />
        } 
        <AccountRSFormInput
            name='recipient'
            label='Recipient'
        />
        <NumericInputComponent
            label='Price'
            name='priceATM'
            placeholder='Price'
            countingTtile={ticker}
            idGroup='sell-alias-account-modal-'
          />
        <MessageInputs idGroup="sell-alias-to-acc-" />
    </>   
  )
}