import React, {
  useEffect, useState, useCallback,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Formik, Form, useFormik, withFormik, useFormikContext,
} from 'formik';
import cn from 'classnames';
import { NotificationManager } from 'react-notifications';
import {
  currencyTypes, multiply, division,
} from '../../../../../../../helpers/format';
import {
  setBodyModalParamsAction, resetTrade, setSelectedOrderInfo,
} from '../../../../../../../modules/modals';
// import { ReactComponent as ArrowRight } from '../../../../../../assets/arrow-right.svg';
import { createOffer } from '../../../../../../../actions/wallet';
import { ONE_GWEI } from '../../../../../../../constants';
import InputForm from '../../../../../../components/input-form';
import CustomInput from '../../../../../../components/custom-input';
import Button from '../../../../../../components/button';
import CustomSelect from '../../../../../../components/select';
import InputRange from '../../../../../../components/input-range';
import NumericInput from '../../../../../../components/form-components/numeric-input1';
import getFullNumber from '../../../../../../../helpers/util/expancionalParser';

export default function BuyForm(props) {
  const { currentCurrency } = useSelector(state => state.exchange);
  const { infoSelectedBuyOrder } = useSelector(state => state.modals);

  const { values, setFieldValue, setValues } = useFormikContext();

  const { currency } = currentCurrency;

  const {
    wallet, walletsList, ethFee, isPending,
  } = props;
  console.log(props);

  const [newCurrentCurrency, setNewCurrentCurrency] = useState(null);
  // const [newWallet, setNewWallet] = useState(null);
  // const [walletsList, setWalletsList] = useState(null);

  // useEffect(() => {
  //   if (currentCurrency && (currency !== newCurrentCurrency || wallet !== newWallet)) {
  //     setValues({
  //       walletAddress: values.walletAddress,
  //       pairRate: '',
  //       offerAmount: '',
  //       total: '',
  //     });
  //   }

  //   const currentWalletsList = (wallet || []).map(currWallet => (
  //     {
  //       value: currWallet,
  //       label: currWallet.address,
  //     }
  //   ));

  //   setNewCurrentCurrency(currency);
  //   setNewWallet(wallet);
  //   setWalletsList(currentWalletsList);
  // }, [currency, currentCurrency, newCurrentCurrency, newWallet, setValues, values.walletAddress, wallet]);

  useEffect(() => {
    if (infoSelectedBuyOrder) {
      const { pairRate, offerAmount, total } = infoSelectedBuyOrder;
      const balance = wallet && wallet[0].balances[currency];
      const normalizePairRate = !pairRate ? 0 : division(pairRate, ONE_GWEI, 9);
      const normalizeOfferAmount = !offerAmount ? 0 : division(offerAmount, ONE_GWEI, 9);
      const normalizeTotal = !total ? 0 : division(total, 10 ** 18, 9);
      const rangeValue = (((normalizePairRate * normalizeOfferAmount) * 100) / (balance || 1)).toFixed(0);
      setValues({
        walletAddress: wallet && wallet[0],
        pairRate: normalizePairRate || '',
        offerAmount: normalizeOfferAmount || '',
        total: normalizeTotal || '',
        range: rangeValue > 100 ? 100 : rangeValue,
      });
    }
  }, [currency, infoSelectedBuyOrder, setValues, wallet]);

  const currencyName = currency.toUpperCase();
  let balance = values.walletAddress && values.walletAddress.balances[currency];
  balance = currency === 'eth' ? balance - ethFee : balance;
  balance = balance < 0 ? 0 : balance;

  return (
    <Form
      className="form-group-app d-flex flex-column justify-content-between h-100 mb-0"
    >
      {/* :In future Check */}
      {/* {walletsList && !!walletsList.length && (
        <div className="form-group mb-3">
          <label>
            {currencyName}
            {' '}
            Wallet
          </label>
          <CustomSelect
            className="form-control"
            field="walletAddress"
            defaultValue={walletsList[0]}
            setValue={setValue}
            options={walletsList}
          />
        </div>
      )} */}
      <div className="form-group mb-0">
        <NumericInput
          name="pairRate"
          label="Price for 1 APL"
          counterLabel={currencyName}
          disableArrows
          type="float"
          placeholder="Price for 1 APL"
          onChange={price => {
            const amount = values.offerAmount || '';
            let rangeValue = (((amount * price) * 100) / (balance || 1)).toFixed(0);
            if (rangeValue > 100) rangeValue = 100;
            setFieldValue('offerAmount', amount);
            setFieldValue('range', rangeValue);
            setFieldValue('total', multiply(amount, price));
          }}
        />
        {/* <CustomInput
          name="pairRate"
          label="Price for 1 APL"
          type="float"
          placeholder="Price for 1 APL"
          disableArrows
          onChange={price => {
            const amount = values.offerAmount || 0;
            let rangeValue = ((amount * price) * 100 / balance).toFixed(0);
            if (rangeValue > 100) rangeValue = 100;
            setFieldValue('offerAmount', amount);
            setFieldValue('range', rangeValue === 'NaN' ? 0 : rangeValue);
            setFieldValue('total', multiply(amount, price));
          }}
        >
          <div className="input-group-append">
            <span className="input-group-text">{currencyName}</span>
          </div>
        </CustomInput> */}
      </div>
      <div className="form-group mb-0">
        <NumericInput
          name="offerAmount"
          label="I want to Buy"
          counterLabel="APL"
          disableArrows
          type="float"
          placeholder="I want to Buy"
          onChange={amount => {
            const pairRate = +values.pairRate || 0;
            let rangeValue = ((amount * pairRate) * 100 / balance).toFixed(0);
            if (rangeValue > 100) rangeValue = 100;
            setFieldValue('offerAmount', amount);
            setFieldValue('range', rangeValue === 'NaN' ? 0 : rangeValue);
            setFieldValue('total', multiply(amount, pairRate));
          }}
        />
        {/* <CustomInput
          name="offerAmount"
          label="I want to Buy"
          type="float"
          placeholder="I want to Buy"
          onChange={amount => {
            const pairRate = +values.pairRate || 0;
            let rangeValue = ((amount * pairRate) * 100 / balance).toFixed(0);
            if (rangeValue > 100) rangeValue = 100;
            setFieldValue('offerAmount', amount);
            setFieldValue('range', rangeValue === 'NaN' ? 0 : rangeValue);
            setFieldValue('total', multiply(amount, pairRate));
          }}
        >
          <div className="input-group-append">
            <span className="input-group-text">APL</span>
          </div>
        </CustomInput> */}
      </div>
      <div className="form-group mb-0">
        <CustomInput
          name="total"
          label="I will pay"
          type="float"
          placeholder="I will pay"
          disabled
        >
          <div className="input-group-append">
            <span className="input-group-text">
              {values.walletAddress && (
              <span className="input-group-info-text">
                <i className="zmdi zmdi-balance-wallet" />
                &nbsp;
                {(getFullNumber(Number(values.walletAddress.balances[currency])))}
                &nbsp;
              </span>
              )}
              {currencyName}
            </span>
            {/* </div> */}
          </div>
        </CustomInput>
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
      </div>
      {/* {values.walletAddress && (
        <InputRange
          field="range"
          min={0}
          max={100}
          disabled={!values.pairRate || values.pairRate === '0' || values.pairRate === ''}
          onChange={amount => {
            const offerAmount = values.pairRate !== '0' ? division((amount * balance), (100 * values.pairRate), 10) : 0;
            const total = multiply(offerAmount, values.pairRate, 14);

            setFieldValue('offerAmount', offerAmount);
            setFieldValue('total', total);
          }}
        />
      )} */}
      <Button
        type="submit"
        color="green"
        size="lg"
        isLoading={isPending}
        name="Buy APL"
        isArrow
      />
    </Form>
  );
}
