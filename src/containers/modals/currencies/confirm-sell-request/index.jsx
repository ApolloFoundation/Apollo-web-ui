/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import TextualInputComponent from '../../../components/form-components/TextualInput';
import ModalBody from '../../../components/modals/modal-body';
import { getModalDataSelector, getTickerSelector } from '../../../../selectors';

export default function SellCurrency({ processForm, closeModal, nameModal }) {
  const dispatch = useDispatch();

  const modalData = useSelector(getModalDataSelector, shallowEqual);
  const ticker = useSelector(getTickerSelector);

  const handleFormSubmit = useCallback(async values => {
    const data = {
      ...values,
      ...modalData,
      rateATM: modalData.rateATM * ((10 ** 8) / (10 ** modalData.decimals)),
      units: modalData.units * (10 ** modalData.decimals),
    };

    processForm(data, 'currencySell', 'The sell order has been submitted!', () => {
      closeModal();
      NotificationManager.success('The sell order has been submitted!', null, 5000);
    });
  }, [dispatch, modalData, processForm, closeModal]);

  return (
    <ModalBody
      modalTitle="Sell Currency"
      isAdvanced
      isFee
      closeModal={closeModal}
      handleFormSubmit={handleFormSubmit}
      submitButtonName="Sell"
      nameModel={nameModal}
    >
      {modalData && (
        <>
          <TextualInputComponent
            label="Order Description"
            text={`Sell ${modalData.units} ${modalData.code} currencies at ${modalData.rateATM / modalData.units} ${ticker} each.`}
          />
          <TextualInputComponent
            label="Total"
            text={`${modalData.rateATM} ${ticker}`}
          />
        </>
      )}
    </ModalBody>
  );
}
