/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import TextualInputComponent from 'containers/components/form-components/TextualInput';
import ModalBody from 'containers/components/modals/modal-body';
import { getDecimalsSelector, getModalDataSelector, getTickerSelector } from 'selectors';
import { bigIntDecimalsDivision, bigIntDivision, bigIntFormat, bigIntMultiply } from 'helpers/util/bigNumberWrappers';

export default function SellCurrency({ processForm, closeModal, nameModal }) {
  const dispatch = useDispatch();

  const modalData = useSelector(getModalDataSelector, shallowEqual);
  const ticker = useSelector(getTickerSelector);
  const decimals = useSelector(getDecimalsSelector);

  const handleFormSubmit = useCallback(async values => {
    const data = {
      ...values,
      ...modalData,
      rateATM: bigIntFormat(bigIntMultiply(modalData.rateATM, bigIntDecimalsDivision(decimals, modalData.decimals))),
      units: bigIntFormat(bigIntMultiply(modalData.units, (10 ** modalData.decimals))),
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
            text={`Sell ${modalData.units} ${modalData.code} currencies at ${bigIntFormat(bigIntDivision(modalData.rateATM, modalData.units))} ${ticker} each.`}
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
