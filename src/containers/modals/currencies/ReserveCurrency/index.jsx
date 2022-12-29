/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import { getModalDataSelector } from '../../../../selectors';
import ModalBody from '../../../components/modals/modal-body1';
import ReserveCurrencyForm from './Form';
import { InfoCurrency } from './InfoCurrency'

export default function ReserveCurrency({ nameModal, closeModal, processForm }) {
  const dispatch = useDispatch();
  const modalData = useSelector(getModalDataSelector);

  const handleFormSubmit = useCallback(async values => {
      if (!values.secretPhrase || values.secretPhrase.length === 0) {
        NotificationManager.error('Secret Phrase is required.', 'Error', 5000);
        return;
      }

      const toSend = {
        currency: modalData.currency,
        decimals: modalData.decimals,
        amountPerUnitATM: Number(values.reserve),
        deadline: 1440,
        phased: false,
        phasingHashedSecretAlgorithm: 2,
        secretPhrase: values.secretPhrase,
        feeATM: values.feeATM,
      };

      await processForm(toSend, 'currencyReserveIncrease', 'Reserve has been increased!', res => {
        NotificationManager.success('Reserve has been increased!', null, 5000);
        closeModal();;
      });
  }, [closeModal, processForm, dispatch]);

  return (
    <ModalBody
      modalTitle="Claim Currency"
      isAdvanced
      isFee
      closeModal={closeModal}
      handleFormSubmit={handleFormSubmit}
      submitButtonName="Claim Currency"
      nameModel={nameModal}
      initialValues={{
        amount: 0
      }}
    >
      <InfoCurrency modalData={modalData} />
      <ReserveCurrencyForm />
    </ModalBody>
  );
}
