import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { Form, useFormikContext } from 'formik';
import { numberToLocaleString } from 'helpers/format';
import CustomInput from 'containers/components/custom-input/CustomInputWithFormik';
import Button from 'containers/components/button';
import CustomSelect from 'containers/components/form-components/CustomSelect';
import { InputRangeWithFormik } from 'containers/components/input-range/InputRangeWithFormik';
import NumericInput from 'containers/components/form-components/NumericInput';
import getFullNumber from 'helpers/util/expancionalParser';
import { getExchangeInfoSelector, getModalsSelector } from 'selectors';
import { ONE_GWEI } from 'constants/constants';
import { bigIntDecimalsDivision, bigIntDivision, bigIntFormat, bigIntFormatLength, bigIntMultiply } from 'helpers/util/bigNumberWrappers';

const handleRange = (amount, price, balance) => bigIntFormatLength(
    bigIntDivision(
      bigIntMultiply(bigIntMultiply(amount, price), 100),
      balance
    ), 0)

export default function BuyForm(props) {
  const { currentCurrency } = useSelector(getExchangeInfoSelector, shallowEqual);
  const { infoSelectedBuyOrder } = useSelector(getModalsSelector, shallowEqual);

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
      const normalizePairRate = !pairRate ? 0 : bigIntFormat(bigIntDivision(pairRate, ONE_GWEI));
      const normalizeOfferAmount = !offerAmount ? 0 : bigIntFormat(bigIntDivision(offerAmount, ONE_GWEI));
      const normalizeTotal = !total ? 0 : bigIntFormat(bigIntDecimalsDivision(total, 18));
      const rangeValue = handleRange(normalizePairRate, normalizeOfferAmount, balance || 1)
      
      setValues({
        walletAddress: walletsList && walletsList[0]?.value,
        pairRate: numberToLocaleString(normalizePairRate, {
          minimumFractionDigits: 9,
          maximumFractionDigits: 9,
        }),
        offerAmount: numberToLocaleString(normalizeOfferAmount, {
          minimumFractionDigits: 9,
          maximumFractionDigits: 9,
        }),
        total: numberToLocaleString(normalizeTotal, {
          minimumFractionDigits: 9,
          maximumFractionDigits: 9,
        }),
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
            let rangeValue = handleRange(amount, price, balance || 1);
            if (rangeValue > 100) rangeValue = 100;

            setFieldValue('offerAmount', amount);
            setFieldValue('range', rangeValue);
            setFieldValue('total',  numberToLocaleString(bigIntFormat(bigIntMultiply(amount, price))), {
              minimumFractionDigits: 0,
              maximumFractionDigits: 10,
            });
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
            let rangeValue = handleRange(amount, pairRate, balance);
            if (rangeValue > 100) rangeValue = 100;

            setFieldValue('offerAmount', amount);
            setFieldValue('range', rangeValue === 'NaN' ? 0 : rangeValue);
            setFieldValue('total', numberToLocaleString(bigIntFormat(bigIntMultiply(amount, pairRate))), {
              minimumFractionDigits: 0,
              maximumFractionDigits: 10,
            })
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
            const offerAmount = values.pairRate !== '0' ? 
              numberToLocaleString(bigIntFormat(bigIntDivision(
                bigIntMultiply(amount, balance),
                bigIntMultiply(100, values.pairRate)
              )), {
                minimumFractionDigits: 10,
                maximumFractionDigits: 10,
              }) : 0;
            const total = numberToLocaleString(bigIntFormat(bigIntMultiply(offerAmount, values.pairRate)), {
              minimumFractionDigits: 0,
              maximumFractionDigits: 14,
            })

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
