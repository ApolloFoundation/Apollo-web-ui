import React from 'react';
import { useFormikContext } from 'formik';
import TextualInputComponent from 'containers/components/form-components/TextualInput';
import NumericInputComponent from 'containers/components/form-components/NumericInput';
import CheckboxFormInput from 'containers/components/check-button-input/CheckboxWithFormik';
import CustomTextArea from 'containers/components/form-components/TextArea/TextAreaWithFormik';

export const AnyoneForm = ({ alias }) => {
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

      <NumericInputComponent
          label='Price'
          name='priceATM'
          placeholder='Price'
      />
      <CheckboxFormInput
          name='add_message'
          label='Add a message?'
          id='add_message-anyone-account-'
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
                  id="encrypt_message-to-anyone"
              />
              <CheckboxFormInput
                  label='Message is Never Deleted'
                  name='permanent_message'
                  id="permanent_message-to-anyone"
              />
          </>
      }
    </>
  );
}