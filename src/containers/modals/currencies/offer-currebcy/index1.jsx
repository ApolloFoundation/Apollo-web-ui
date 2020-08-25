/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, {
  useState, useEffect, useCallback,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import { getAccountCurrenciesAction } from '../../../../actions/currencies';
import { handleFormSubmit } from './handleFormSubmit';

import ModalBody from '../../../components/modals/modal-body1';
import NumericInput from '../../../components/form-components/numeric-input1';
import TextualInputComponent from '../../../components/form-components/textual-input1';
import BlockHeightInput from '../../../components/form-components/block-height-input1';

export default function OfferCurrency(props) {
  const dispatch = useDispatch();

  const { modalData } = useSelector(state => state.modals);
  const { account } = useSelector(state => state.account);

  const { closeModal } = props;

  const [currencyAvailable, setCurrencyAvailable] = useState(null);
  const [dataCurrency, setDataCurrency] = useState(null);

  const formSubmit = useCallback(values => {
    if (!dataCurrency) {
      NotificationManager.error('Impossible to create an offer with zero balance of currency.', 'Error', 5000);
      return;
    }
    const { currency, decimals } = dataCurrency;
    handleFormSubmit({
      ...values, currency, decimals,
    });
  }, [dataCurrency]);

  const getCurrency = useCallback(async () => {
    const currency = await dispatch(getAccountCurrenciesAction({
      currency: modalData.currency,
      account,
      includeCurrencyInfo: true,
    }));

    if (currency && currency.unconfirmedUnits) {
      setCurrencyAvailable(currency.unconfirmedUnits / (10 ** currency.decimals));
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
      modalTitle="Offer Currencyy"
      isAdvanced
      isFee
      closeModal={closeModal}
      handleFormSubmit={values => formSubmit(values)}
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
        countingTtile={`${modalData.code} / APL`}
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
        countingTtile={`${modalData.code} / APL`}
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
