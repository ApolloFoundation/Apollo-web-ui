import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { Form, useFormikContext } from 'formik';
import { multiply, division, numberToLocaleString } from 'helpers/format';
import Button from 'containers/components/button';
import NumericInput from 'containers/components/form-components/NumericInput';
import CustomInput from 'containers/components/custom-input/CustomInputWithFormik';
import { InputRangeWithFormik } from 'containers/components/input-range/InputRangeWithFormik';
import CustomSelect from 'containers/components/form-components/CustomSelect';
import { getModalsSelector } from 'selectors';
import { ONE_GWEI } from 'constants/constants';
import { bigIntDecimalsDivision, bigIntDivision, bigIntFormat, bigIntFormatLength, bigIntMultiply } from 'helpers/util/bigNumberWrappers';

const handleRange = (amount, balance) => bigIntFormatLength(bigIntDivision(bigIntMultiply(amount, 100), balance),0);

export default function SellForm(props) {
  const { values, setFieldValue, setValues } = useFormikContext();

  const { infoSelectedSellOrder } = useSelector(getModalsSelector, shallowEqual);

  const {
    wallet, isPending, currency, dashboardAccoountInfo, balanceAPL, decimals, ticker,
  } = props;

  const balance = (dashboardAccoountInfo && dashboardAccoountInfo.unconfirmedBalanceATM)
    ? dashboardAccoountInfo.unconfirmedBalanceATM
    : balanceAPL;
  const balanceFormat = balance ? (balance / decimals) : 0;

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
    if (infoSelectedSellOrder) {
      const { pairRate, offerAmount, total } = infoSelectedSellOrder;
      const normalizePairRate = !pairRate ? 0 : bigIntDivision(pairRate, ONE_GWEI);
      const normalizeOfferAmount = !offerAmount ? 0 : bigIntDivision((offerAmount, ONE_GWEI));
      const normalizeTotal = !total ? 0 : bigIntDecimalsDivision(total, 18);
      const rangeValue = handleRange(normalizeOfferAmount, balanceFormat);
      
      setValues({
        walletAddress: walletsList && walletsList[0]?.value,
        pairRate: numberToLocaleString(bigIntFormat(normalizePairRate), {
          minimumFractionDigits: 9,
          maximumFractionDigits: 9,
        }),
        offerAmount: numberToLocaleString(bigIntFormat(normalizeOfferAmount), {
          minimumFractionDigits: 9,
          maximumFractionDigits: 9,
        }),
        total: numberToLocaleString(bigIntFormat(normalizeTotal), {
          minimumFractionDigits: 9,
          maximumFractionDigits: 9,
        }),
        range: rangeValue > 100 ? 100 : rangeValue,
      });
    }
  }, [balanceFormat, infoSelectedSellOrder, setValues, wallet, walletsList]);

  const currencyName = currency.toUpperCase();
  const numberTypes = {
    NaN: '0',
    Infinity: 100,
  };
  return (
    <Form className="form-group-app d-flex flex-column justify-content-between h-100 mb-0">
      {walletsList && !!walletsList.length && (
          <CustomSelect
            label={`${currencyName} Wallet`}
            className="form-control"
            name="walletAddress"
            options={walletsList}
          />
      )}
      <div className="form-group  mb-0">
        <NumericInput
          name="pairRate"
          label={`Price for 1 ${ticker}`}
          counterLabel={currencyName}
          disableArrows
          type="float"
          placeholder={`Price for 1 ${ticker}`}
          onChange={price => {
            let amount = values.offerAmount || 0;
            if (balanceFormat) {
              if (amount > balanceFormat) {
                amount = balanceFormat;
              }
              const rangeValue = handleRange(amount, balanceFormat);
              setFieldValue('range', numberTypes[rangeValue] || rangeValue);
            }
            setFieldValue('total', numberToLocaleString(bigIntFormat(bigIntMultiply(amount, price)),{
              minimumFractionDigits: 0,
              maximumFractionDigits: 10,
            }));
          }}
          classNameWrapper="mb-0"
        />
      </div>
      <div className="form-group mb-0">
        <div className="input-group">
          <CustomInput
            name="offerAmount"
            label="I want to Sell"
            type="float"
            placeholder="I want to Sell"
            disableArrows
            onChange={amount => {
              const pairRate = +values.pairRate || 0;
              let newAmount = amount;
              if (+balanceFormat) {
                if (+newAmount > +balanceFormat) {
                  newAmount = balanceFormat;
                }
                const rangeValue = handleRange(newAmount, balanceFormat);
                setFieldValue('range', numberTypes[rangeValue] || rangeValue);
              }
              setFieldValue('total', numberToLocaleString(bigIntFormat(bigIntMultiply(newAmount, pairRate)),{
                minimumFractionDigits: 0,
                maximumFractionDigits: 10,
              }));
            }}
          >
            <div className="input-group-append">
              <span className="input-group-text">
                {wallet && balanceFormat !== false && (
                  <span className="input-group-info-text">
                    <i className="zmdi zmdi-balance-wallet" />
                    &nbsp;
                    {numberToLocaleString(balanceFormat, {
                      minimumFractionDigits: 3,
                      maximumFractionDigits: 3,
                    })}
                    &nbsp;
                  </span>
                )}
                {ticker}
              </span>
            </div>
          </CustomInput>
        </div>
        <small className="text-note">Will be frozen on your balance during 24 hours.</small>
      </div>
      <div className="form-group mb-0">
        <NumericInput
          name="total"
          label="I will pay"
          counterLabel={currencyName}
          disableArrows
          type="float"
          placeholder="I will pay"
          disabled
          classNameWrapper='mb-0'
        />
      </div>
      {values.walletAddress && (
        <InputRangeWithFormik
          name="range"
          min={0}
          max={100}
          onChange={e => {
            const amount = e.target.value;
            const offerAmount = values.pairRate !== '0' ? bigIntDivision(bigIntMultiply(amount, balanceFormat), 100) : 0;
            const total = numberToLocaleString(bigIntFormat(bigIntMultiply(offerAmount, values.pairRate)), {
              minimumFractionDigits: 0,
              maximumFractionDigits: 14,
            });
            setFieldValue('offerAmount', bigIntFormatLength(offerAmount, 3));
            setFieldValue('total', total);
          }}
        />
      )}
      <Button
        type="submit"
        color="green"
        size="lg"
        isLoading={isPending}
        name={`Sell ${ticker}`}
        isArrow
      />
    </Form>
  );
}
