/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import { setBodyModalParamsAction } from '../../../../modules/modals';
import TextualInputComponent from '../../../components/form-components/textual-input/textual-input1';
import ModalBody from '../../../components/modals/modal-body1';
import { getModalDataSelector, getTickerSelector } from '../../../../selectors';

export default function SellCurrency(props) {
  const dispatch = useDispatch();

  const { processForm, closeModal, nameModal } = props;

  const modalData = useSelector(getModalDataSelector);
  const ticker = useSelector(getTickerSelector);

  const handleFormSubmit = useCallback(async values => {
    const data = {
      ...values,
      ...modalData,
      rateATM: modalData.rateATM * ((10 ** 8) / (10 ** modalData.decimals)),
      units: modalData.units * (10 ** modalData.decimals),
    };

    processForm(data, 'currencySell', 'The sell order has been submitted!', () => {
      dispatch(setBodyModalParamsAction(null, {}));
      NotificationManager.success('The sell order has been submitted!', null, 5000);
    });
  }, [dispatch, modalData, processForm]);

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
