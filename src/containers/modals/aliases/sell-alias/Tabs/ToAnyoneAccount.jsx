import React from 'react';
import ModalBody from 'containers/components/modals/modal-body';
import { AnyoneForm } from './forms/AnyoneForm';

export const ToAnyoneAccount = ({ onSubmit, closeModal, alias }) => (
  <ModalBody
    handleFormSubmit={onSubmit}
    closeModal={closeModal}
    className='p-0 transparent gray-form'
    submitButtonName='Sell alias'
    isFee
    isPour
    idGroup='sell-alias-anyone-modal-'
    initialValues={{
      priceATM: 0,
      add_message: false,
      message: '',
      encrypt_message: false,
      permanent_message: false,
    }}
  >
    <AnyoneForm alias={alias} />
  </ModalBody>
);
