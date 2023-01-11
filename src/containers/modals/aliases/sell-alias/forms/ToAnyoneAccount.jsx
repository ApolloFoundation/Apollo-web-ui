import React from 'react';
import { useFormikContext } from 'formik';
import ModalBody from '../../../../components/modals/modal-body';
import TextualInputComponent from '../../../../components/form-components/TextualInput';
import NumericInputComponent from '../../../../components/form-components/NumericInput';
import CheckboxFormInput from '../../../../components/check-button-input';
import CustomTextArea from '../../../../components/form-components/TextArea/TextAreaWithFormik';

export const ToAnyoneAccount = ({ onSubmit, closeModal, alias }) => {
  const { values } = useFormikContext();

  return (
    <ModalBody
      handleFormSubmit={onSubmit}
      closeModal={closeModal}
      className='p-0 transparent gray-form'
      submitButtonName='Sell alias'
      isFee
      isPour
      idGroup='sell-alias-anyone-modal-'
      submitButtonName='Sell Alias'
    >
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
    </ModalBody>
  );
}
