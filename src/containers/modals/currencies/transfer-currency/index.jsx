/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import ModalBody from 'containers/components/modals/modal-body';
import AccountRSFormInput from 'containers/components/form-components/AccountRS';
import NumericInput from 'containers/components/form-components/NumericInput';
import CurrencyInput from 'containers/components/form-components/CurrencyInput';
import { getModalDataSelector } from 'selectors';
import { handleFormSubmit } from './handle-form-submit';

export default function TransferCurrency({ closeModal }) {
  const dispatch = useDispatch();

  const modalData = useSelector(getModalDataSelector, shallowEqual);
  
  const handleSubmit = useCallback(values => {
    const data = {
      ...values,
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
        // decimals and currency fields for CurrenCYInput component and important to add their to the initial form values
        currency: '',
        decimals: '',
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
