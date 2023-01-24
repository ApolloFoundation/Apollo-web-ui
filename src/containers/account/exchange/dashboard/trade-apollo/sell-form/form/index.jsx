import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Form, useFormikContext } from 'formik';
import { ONE_GWEI } from '../../../../../../../constants';
import { multiply, division, numberToLocaleString } from '../../../../../../../helpers/format';
import Button from '../../../../../../components/button';
import NumericInput from '../../../../../../components/form-components/numeric-input1';
import CustomInput from '../../../../../../components/custom-input';
import InputRange from '../../../../../../components/input-range/index1';
import CustomSelect from '../../../../../../components/select/index1';

export default function SellForm(props) {
  const { values, setFieldValue, setValues } = useFormikContext();

  const { infoSelectedSellOrder } = useSelector(state => state.modals);

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
      const normalizePairRate = !pairRate ? 0 : division(pairRate, ONE_GWEI, 9);
      const normalizeOfferAmount = !offerAmount ? 0 : division(offerAmount, ONE_GWEI, 9);
      const normalizeTotal = !total ? 0 : division(total, 10 ** 18, 9);
      const rangeValue = ((normalizeOfferAmount * 100) / balanceFormat).toFixed(0);
      setValues({
        walletAddress: walletsList && walletsList[0],
        pairRate: normalizePairRate,
        offerAmount: normalizeOfferAmount,
        total: normalizeTotal,
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
        <div className="form-group mb-3">
          <label>
            {currencyName}
            {' '}
            Wallet
          </label>
          <CustomSelect
            className="form-control"
            name="walletAddress"
            options={walletsList}
          />
        </div>
      )}
      <div className="form-group mb-0">
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
              const rangeValue = ((amount * 100) / balanceFormat).toFixed(0);
              setFieldValue('range', numberTypes[rangeValue] || rangeValue);
            }
            setFieldValue('total', multiply(amount, price));
          }}
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
                const rangeValue = ((newAmount * 100) / balanceFormat).toFixed(0);
                setFieldValue('range', numberTypes[rangeValue] || rangeValue);
              }
              setFieldValue('total', multiply(newAmount, pairRate));
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
        />
      </div>
      {values.walletAddress && (
        <InputRange
          name="range"
          min={0}
          max={100}
          onChange={amount => {
            const offerAmount = values.pairRate !== '0' ? ((amount * balanceFormat) / 100).toFixed(3) : 0;
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
        name={`Sell ${ticker}`}
        isArrow
      />
    </Form>
  );
}
