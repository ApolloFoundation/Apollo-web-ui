import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Form, useFormikContext } from 'formik';
import { multiply, division } from '../../../../../../../helpers/format';
import { ONE_GWEI } from '../../../../../../../constants';
import CustomInput from '../../../../../../components/custom-input/CustomInputWithFormik';
import Button from '../../../../../../components/button';
import CustomSelect from '../../../../../../components/form-components/CustomSelect';
import { InputRangeWithFormik } from '../../../../../../components/input-range/InputRangeWithFormik';
import NumericInput from '../../../../../../components/form-components/NumericInput';
import getFullNumber from '../../../../../../../helpers/util/expancionalParser';

export default function BuyForm(props) {
  const { currentCurrency } = useSelector(state => state.exchange);
  const { infoSelectedBuyOrder } = useSelector(state => state.modals);

  const { values, setFieldValue, setValues } = useFormikContext();

  const { currency } = currentCurrency;

  const {
    wallet, ethFee, isPending, passPhrase, ticker,
  } = props;

  const [walletsList, setWalletsList] = useState(null);

  useEffect(() => {
    const currentWalletsList = (wallet || []).map(currWallet => (
      {
        value: currWallet,
        label: currWallet.address,
      }
    ));

    setWalletsList(currentWalletsList);
  }, [wallet]);

  useEffect(() => {
    if (infoSelectedBuyOrder) {
      const { pairRate, offerAmount, total } = infoSelectedBuyOrder;
      const balance = wallet && +wallet[0].balances[currency];
      const normalizePairRate = !pairRate ? 0 : division(pairRate, ONE_GWEI, 9);
      const normalizeOfferAmount = !offerAmount ? 0 : division(offerAmount, ONE_GWEI, 9);
      const normalizeTotal = !total ? 0 : division(total, 10 ** 18, 9);
      const rangeValue = (
        ((normalizePairRate * normalizeOfferAmount) * 100) / (balance || 1)
      ).toFixed(0);
      setValues({
        walletAddress: walletsList && walletsList[0]?.value,
        pairRate: normalizePairRate,
        offerAmount: normalizeOfferAmount,
        total: normalizeTotal,
        range: rangeValue > 100 ? 100 : rangeValue,
      });
    }
  }, [currency, infoSelectedBuyOrder, setValues, wallet, walletsList, passPhrase]);

  const currencyName = currency.toUpperCase();
  let balance = values.walletAddress && values.walletAddress.balances?.[currency];
  balance = currency === 'eth' ? balance - ethFee : balance;
  balance = balance < 0 ? 0 : balance;

  return (
    <Form
      className="form-group-app d-flex flex-column justify-content-between h-100 mb-0"
    >
      {walletsList && !!walletsList.length && (
          <CustomSelect
            label={`${currencyName} Wallet`}
            className="form-control"
            name="walletAddress"
            options={walletsList}
          />
      )}
        <NumericInput
          name="pairRate"
          label={`Price for 1 ${ticker}`}
          counterLabel={currencyName}
          disableArrows
          type="float"
          placeholder={`Price for 1 ${ticker}`}
          onChange={price => {
            const amount = values.offerAmount || 0;
            let rangeValue = (((amount * price) * 100) / (balance || 1)).toFixed(0);
            if (rangeValue > 100) rangeValue = 100;

            setFieldValue('offerAmount', amount);
            setFieldValue('range', rangeValue);
            setFieldValue('total', multiply(amount, price));
          }}
          classNameWrapper="mb-2"
          />
        <NumericInput
          name="offerAmount"
          label="I want to Buy"
          counterLabel={ticker}
          disableArrows
          type="float"
          placeholder="I want to Buy"
          onChange={amount => {
            const pairRate = values.pairRate || 0;
            let rangeValue = (((amount * pairRate) * 100) / balance).toFixed(0);
            if (rangeValue > 100) rangeValue = 100;

            setFieldValue('offerAmount', amount);
            setFieldValue('range', rangeValue === 'NaN' ? 0 : rangeValue);
            setFieldValue('total', multiply(amount, pairRate));
          }}
          classNameWrapper="mb-2"
        />
        <div className="input-group">
          <CustomInput
            name="total"
            label="I will pay"
            type="float"
            placeholder="I will pay"
            disabled
            classNameWrapper="mb-0"
          >
            <div className="input-group-append">
              <span className="input-group-text">
                {values.walletAddress && (
                  <span className="input-group-info-text">
                    <i className="zmdi zmdi-balance-wallet" />
                    &nbsp;
                    {(getFullNumber(Number(values.walletAddress.balances?.[currency] ?? 0)))}
                    &nbsp;
                  </span>
                )}
                {currencyName}
              </span>
            </div>
          </CustomInput>
        </div>
        {ethFee && (
        <div className="text-right">
          <small className="text-note">
            {' '}
            Max Fee:
            {ethFee}
            {' '}
            ETH
          </small>
        </div>
        )}
      {values.walletAddress && (
        <InputRangeWithFormik
          name="range"
          min={0}
          max={100}
          disabled={!values.pairRate || values.pairRate === '0' || values.pairRate === ''}
          onChange={e => {
            const amount = e.target.value;
            const offerAmount = values.pairRate !== '0' ? division((amount * balance), (100 * values.pairRate), 10) : 0;
            const total = multiply(offerAmount, values.pairRate, 14);

            setFieldValue('offerAmount', offerAmount);
            setFieldValue('total', total);
          }}
        />
      )}
      <Button
        type="submit"
        color="green"
        size="lg"
        isLoading={isPending}
        name={`Buy ${ticker}`}
        isArrow
      />
    </Form>
  );
}
