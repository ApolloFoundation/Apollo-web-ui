/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, {
  useState, useEffect, useCallback,
} from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import { getCurrencyAction, getAccountCurrenciesAction } from 'actions/currencies';
import TextualInputComponent from 'containers/components/form-components/TextualInput';
import FormRowText from 'containers/components/form-components/FormTextRow';
import ModalBody from 'containers/components/modals/modal-body';
import { getAccountSelector, getModalDataSelector, getTickerSelector } from 'selectors';

export default function ClaimCurrency(props) {
  const dispatch = useDispatch();

  const { nameModal, closeModal, processForm } = props;

  const modalData = useSelector(getModalDataSelector, shallowEqual);
  const ticker = useSelector(getTickerSelector);
  const account= useSelector(getAccountSelector);

  const [dataCurrency, setDataCurrency] = useState(null);
  const [dataAccountCurrecny, setDataAccountCurrecny] = useState(null);

  const getCurrency = useCallback(async currency => {
    const currencyInfo = await dispatch(getAccountCurrenciesAction({ currency, account }));
    const accountCurrecny = await dispatch(getCurrencyAction({ currency }));

    if (currency && accountCurrecny) {
      setDataCurrency(currencyInfo);
      setDataAccountCurrecny(accountCurrecny);
    }
  }, [account, dispatch]);

  const handleFormSubmit = useCallback(values => {
    processForm({ ...values, currency: dataCurrency ? dataCurrency.currency : null }, 'currencyReserveClaim', 'Claim currency has been submitted!', () => {
      closeModal();
      NotificationManager.success('Claim currency has been submitted!', null, 5000);
    });
  }, [dataCurrency, dispatch, processForm, closeModal]);

  useEffect(() => {
    getCurrency(modalData);
  }, []);

  return (
    <ModalBody
      modalTitle="Claim Currency"
      isAdvanced
      isFee
      closeModal={closeModal}
      handleFormSubmit={handleFormSubmit}
      submitButtonName="Claim Currency"
      initialValues={{ units: '' }}
      nameModel={nameModal}
    >
      {dataAccountCurrecny && dataCurrency && (
        <FormRowText
          text={`Number of units to claim
            ${dataAccountCurrecny.currentSupply / (10 ** dataAccountCurrecny.decimals)}
            Claim rate
            ${dataAccountCurrecny.currentReservePerUnitATM / (10 ** dataAccountCurrecny.decimals)}
            [${ticker}/${dataCurrency.code}]`}
        />
      )}
      <TextualInputComponent
        label="Number of units to claim"
        placeholder="Number of units"
        name="units"
        type="tel"
        code={dataCurrency ? dataCurrency.code : ''}
      />
    </ModalBody>
  );
}
