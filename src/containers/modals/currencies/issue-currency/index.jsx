/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React from 'react';
import { handleFormSubmit } from './handle-form-submit';
import ModalBody from '../../../components/modals/modal-body';
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
        type1: false,
        type2: false,
        type3: false,
        type4: false,
        type5: false,
        type6: false,
      }}
    >
      <IssueCurrencyForm />
    </ModalBody>
  );
}
