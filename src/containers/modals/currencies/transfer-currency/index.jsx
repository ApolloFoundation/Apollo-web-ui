/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ModalBody from '../../../components/modals/modal-body1';
import AccountRSFormInput from '../../../components/form-components/account-rs1';
import NumericInput from '../../../components/form-components/NumericInput/numeric-input1';
import CurrencyInput from '../../../components/form-components/currency-input1';
import { getModalDataSelector } from '../../../../selectors';
import { handleFormSubmit } from './handle-form-submit';

export default function TransferCurrency({ closeModal }) {
  const dispatch = useDispatch();

  const modalData = useSelector(getModalDataSelector);
  
  const handleSubmit = useCallback(values => {
    const data = {
      ...values,
      currency: modalData.currency,
      decimals: modalData.decimals
    };
    dispatch(handleFormSubmit(data));
  }, [dispatch, modalData]);

  return (
    <ModalBody
      modalTitle="Transfer Currency"
      isAdvanced
      isFee
      closeModal={closeModal}
      handleFormSubmit={handleSubmit}
      submitButtonName="Transfer Currency"
      initialValues={{
        code: modalData.code,
        recipient: modalData.recipient,
        units: '',
      }}
    >
      <CurrencyInput
        name="code"
        placeholder="Code"
        code={modalData.code}
        disabled={!modalData}
      />
      <AccountRSFormInput
        name="recipient"
        placeholder="Recipient"
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
