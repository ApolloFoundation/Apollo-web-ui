import React from 'react';
import ModalBody from 'containers/components/modals/modal-body';
import { SpecificForm } from './forms/SpecificForm'

export const ToSpecificAccount = ({ ticker, alias, closeModal, onSubmit }) => (
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
      add_message: false,
      recipient: alias ? alias.accountRS : '',
      priceATM: '',
      message: '',
      encrypt_message: false,
      permanent_message: false,
    }}
  >
    <SpecificForm alias={alias} ticker={ticker} /> 
  </ModalBody>
);
