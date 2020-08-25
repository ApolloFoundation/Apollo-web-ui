/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { handleFormSubmit } from './handleFormSubmit';

// Form components

import ModalBody from '../../../components/modals/modal-body1';
import AccountRSFormInput from '../../../components/form-components/account-rs1';
import NumericInput from '../../../components/form-components/numeric-input1';
import CurrencyInput from '../../../components/form-components/currency-input1';

export default function TransferCurrency(props) {
  const dispatch = useDispatch();

  const { modalData } = useSelector(state => state.modals);

  const { closeModal } = props;

  const formSubmit = useCallback(values => {
    dispatch(handleFormSubmit(values));
  }, [dispatch]);

  return (
    <ModalBody
      modalTitle="Transfer Currency"
      isAdvanced
      isFee
      closeModal={closeModal}
      handleFormSubmit={values => formSubmit(values)}
      submitButtonName="Transfer Currency"
    >
      <CurrencyInput
        name="code"
        defaultValue={modalData.code}
        disabled={!modalData}
      />
      <AccountRSFormInput
        defaultValue={modalData.recipient}
        name="recipient"
        label="Recipient"
      />
      <NumericInput
        name="units"
        label="Units"
        placeholder="Units"
      />
    </ModalBody>
  );
}
