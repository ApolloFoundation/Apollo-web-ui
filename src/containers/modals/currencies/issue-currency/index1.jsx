/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from 'react';
import { handleFormSubmit } from './handleFormSubmit';

// Form components

import ModalBody from '../../../components/modals/modal-body';
import IssueCurrencyForm from './form1';

export default function (props) {
  const { closeModal } = props;

  const formSubmit = values => handleFormSubmit.call(props, values);

  return (
    <ModalBody
      modalTitle="Issue Currency"
      isAdvanced
      isFee
      closeModal={closeModal}
      handleFormSubmit={formSubmit}
      submitButtonName="Issue Currency"
      idGroup="issue-currency-modal-"
    >
      <IssueCurrencyForm />
    </ModalBody>
  );
}
