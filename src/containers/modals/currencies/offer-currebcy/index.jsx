/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, {
  useState, useEffect, useCallback,
} from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import { getAccountCurrenciesAction } from 'actions/currencies';
import ModalBody from 'containers/components/modals/modal-body';
import NumericInput from 'containers/components/form-components/NumericInput';
import TextualInputComponent from 'containers/components/form-components/TextualInput';
import BlockHeightInput from 'containers/components/form-components/BlockHeight/block-height-input1';
import { getAccountSelector, getModalDataSelector, getTickerSelector } from 'selectors';
import { bigIntDecimalsDivision, bigIntFormat } from 'helpers/util/bigNumberWrappers';
import { handleFormSubmit } from './handle-form-submit';

export default function OfferCurrency({ closeModal }) {
  const dispatch = useDispatch();

  const modalData = useSelector(getModalDataSelector, shallowEqual);
  const ticker = useSelector(getTickerSelector);
  const account = useSelector(getAccountSelector);

  const [currencyAvailable, setCurrencyAvailable] = useState(null);
  const [dataCurrency, setDataCurrency] = useState(null);

  const handleSubmit = useCallback(values => {
    if (!dataCurrency) {
      NotificationManager.error('Impossible to create an offer with zero balance of currency.', 'Error', 5000);
      return;
    }
    const { currency, decimals } = dataCurrency;
    dispatch(handleFormSubmit({
      ...values, currency, decimals,
    }));
  }, [dataCurrency, dispatch]);

  const getCurrency = useCallback(async () => {
    const currency = await dispatch(getAccountCurrenciesAction({
      currency: modalData.currency,
      account,
      includeCurrencyInfo: true,
    }));

    if (currency && currency.unconfirmedUnits) {
      setCurrencyAvailable(bigIntFormat(bigIntDecimalsDivision(currency.unconfirmedUnits, currency.decimals)));
      setDataCurrency(currency);
    } else {
      setCurrencyAvailable(null);
    }
  }, [modalData.currency, account, dispatch]);

  useEffect(() => {
    getCurrency();
  }, []);

  return (
    <ModalBody
      modalTitle="Offer Currency"
      isAdvanced
      isFee
      closeModal={closeModal}
      handleFormSubmit={handleSubmit}
      initialValues={{
        initialBuySupply: '',
        totalBuyLimit: '',
        buyRateATM: '',
        initialSellSupply: '',
        totalSellLimit: '',
        sellRateATM: '',
        expirationHeight: '',
      }}
      submitButtonName="Offer Currency"
    >
      <TextualInputComponent
        label={`Currency ${modalData.code}`}
        text={currencyAvailable
          ? `Currency units available ${(currencyAvailable)}`
          : 'None Available'}
      />
      <NumericInput
        label="Buy units (Initial)"
        name="initialBuySupply"
        countingTtile={modalData.code}
        placeholder="Amount"
        type="tel"
      />
      <NumericInput
        label="Buy units (Limit)"
        name="totalBuyLimit"
        countingTtile={modalData.code}
        placeholder="Amount"
        type="tel"
      />
      <NumericInput
        label="Buy Rate per unit"
        name="buyRateATM"
        countingTtile={`${modalData.code} / ${ticker}`}
        placeholder="Amount"
        type="tel"
      />
      <NumericInput
        label="Sell units (Initial)"
        name="initialSellSupply"
        countingTtile={modalData.code}
        placeholder="Amount"
        type="tel"
      />
      <NumericInput
        label="Sell units (Limit)"
        name="totalSellLimit"
        countingTtile={modalData.code}
        placeholder="Amount"
        type="tel"
      />
      <NumericInput
        label="Sell Rate per unit"
        name="sellRateATM"
        countingTtile={`${modalData.code} / ${ticker}`}
        placeholder="Amount"
        type="tel"
      />
      <BlockHeightInput
        label="Finish height"
        name="expirationHeight"
        placeholder="Finish height"
      />
    </ModalBody>
  );
}
