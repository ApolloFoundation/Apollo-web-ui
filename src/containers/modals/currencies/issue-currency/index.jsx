/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from 'react';
import { handleFormSubmit } from './handle-form-submit';
import ModalBody from '../../../components/modals/modal-body1';
import IssueCurrencyForm from './form';

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
      initialValues={{
        name: '',
        code: '',
        description: '',
        minReservePerUnitATM: '',
        reserveSupply: '',
        minDifficulty: '',
        maxDifficulty: '',
        initialSupply: '',
        maxSupply: '',
        decimals: '',
        height: '',
      }}
    >
      <IssueCurrencyForm />
    </ModalBody>
  );
}
