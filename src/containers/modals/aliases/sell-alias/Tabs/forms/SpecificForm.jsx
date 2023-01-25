import React from 'react';
import { useFormikContext } from 'formik';
import TextualInputComponent from 'containers/components/form-components/TextualInput';
import AccountRSFormInput from 'containers/components/form-components/AccountRS';
import NumericInputComponent from 'containers/components/form-components/NumericInput';
import CheckboxFormInput from 'containers/components/check-button-input/CheckboxWithFormik';
import CustomTextArea from 'containers/components/form-components/TextArea/TextAreaWithFormik';

export const SpecificForm = ({ alias, ticker }) => {
  const { values } = useFormikContext();
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
        <CheckboxFormInput
            name="add_message"
            label="Add a message?"
            id='sell-alias-to-acc-'
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
                    id="encrypt_message-to-account"
                />
                <CheckboxFormInput
                    label='Message is Never Deleted'
                    name='permanent_message'
                    id="permanent_message-to-account"
                />
            </>
        }
    </>   
  )
}