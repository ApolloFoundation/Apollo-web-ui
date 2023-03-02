/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useCallback } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import ModalBody from 'containers/components/modals/modal-body';
import TextualInputComponent from 'containers/components/form-components/TextualInput';
import { getDecimalsSelector, getModalDataSelector, getTickerSelector } from 'selectors';
import { bigIntDecimalsDivision, bigIntDivision, bigIntFormat, bigIntMultiply } from 'helpers/util/bigNumberWrappers';

export default function BuyCurrency({ processForm, closeModal, nameModal }) {
  const dispatch = useDispatch();

  const modalData= useSelector(getModalDataSelector, shallowEqual);
  const ticker = useSelector(getTickerSelector);
  const decimals = useSelector(getDecimalsSelector);

  const handleFormSubmit = useCallback(async values => {
    const data = {
      ...values,
      ...modalData,
      rateATM: bigIntFormat(bigIntMultiply(modalData.rateATM, bigIntDecimalsDivision(decimals, modalData.decimals))),
      units: bigIntFormat(bigIntMultiply(modalData.units, 10 ** modalData.decimals)),
    };

    processForm(data, 'currencyBuy', 'The buy order has been submitted!', () => {
      closeModal();
      NotificationManager.success('The buy order has been submitted!', null, 5000);
    });
  }, [dispatch, modalData, processForm, closeModal]);

  return (
    <ModalBody
      modalTitle="Buy Currency"
      isAdvanced
      isFee
      closeModal={closeModal}
      handleFormSubmit={handleFormSubmit}
      submitButtonName="Buy"
      nameModel={nameModal}
    >
      {modalData && (
      <>
        <TextualInputComponent
          label="Order Description"
          text={`Buy ${modalData.units} ${modalData.code} currencies at ${bigIntFormat(bigIntDivision(modalData.rateATM, modalData.units))} ${ticker} each.`}
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
