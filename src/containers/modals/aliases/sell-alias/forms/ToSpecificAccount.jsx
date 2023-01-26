import React from 'react';
import { useFormikContext } from 'formik';
import ModalBody from '../../../../components/modals/modal-body';
import TextualInputComponent from '../../../../components/form-components/TextualInput';
import AccountRSFormInput from '../../../../components/form-components/AccountRS';
import NumericInputComponent from '../../../../components/form-components/NumericInput';
import CheckboxFormInput from '../../../../components/check-button-input/CheckboxWithFormik';
import CustomTextArea from '../../../../components/form-components/TextArea/TextAreaWithFormik';

export const ToSpecificAccount = ({ ticker, alias, closeModal, onSubmit }) => {
  const { values } = useFormikContext();

  return (
    <ModalBody
      handleFormSubmit={onSubmit}
      closeModal={closeModal}
      className='p-0 transparent gray-form'
      submitButtonName='Sell Alias'
      isFee
      isPour
      isAdvanced
      isAdvancedWhite
      idGroup='sell-alias-account-modal-'
      initialValues={{
        encrypt_message: true,
        recipient: alias ? alias.accountRS : ''
      }}
    >
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
          nane="add_message"
          label="Add a message?"
          id='sell-alias-account-modal-'
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
    </ModalBody>
  );
}
