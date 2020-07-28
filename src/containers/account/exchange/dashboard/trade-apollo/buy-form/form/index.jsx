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

const feeATM = 200000000;

export default function BuyForm(props) {
  const dispatch = useDispatch();
  const { currentCurrency } = useSelector(state => state.exchange);
  const { dashboardAccoountInfo } = useSelector(state => state.dashboard);
  const { infoSelectedBuyOrder } = useSelector(state => state.modals);
  const { unconfirmedBalanceATM: balanceAPL, account, passPhrase } = useSelector(state => state.account);

  const { values, setFieldValue, setValues } = useFormikContext();

  const { currency } = currentCurrency;

  const { wallet, handleLoginModal, ethFee } = props;
  console.log(props);

  const [isPending, setIsPending] = useState(false);
  const [newCurrentCurrency, setNewCurrentCurrency] = useState(null);
  const [newWallet, setNewWallet] = useState(null);
  const [walletsList, setWalletsList] = useState(null);

  const setPending = useCallback((value = true) => { setIsPending(value); }, []);

  const handleFormSubmit = useCallback(newValues => {
    debugger
    if (!isPending) {
      const pairRateInfo = multiply(newValues.pairRate, ONE_GWEI);
      const offerAmountInfo = multiply(newValues.offerAmount, ONE_GWEI);
      const totalInfo = pairRateInfo * offerAmountInfo;
      dispatch(setSelectedOrderInfo({
        pairRate: pairRateInfo,
        offerAmount: offerAmountInfo,
        total: totalInfo,
        type: 'BUY',
      }));
      setPending();
      if (wallet) {
        if (newValues.offerAmount > 0 && newValues.pairRate > 0) {
          const balance = newValues.walletAddress && newValues.walletAddress.balances[currency];
          let isError = false;
          if (+newValues.pairRate < 0.000000001) {
            NotificationManager.error(`Price must be more then 0.000000001 ${currency.toUpperCase()}`, 'Error', 5000);
            isError = true;
          }
          if (+newValues.offerAmount < 0.001) {
            NotificationManager.error('You can buy more then 0.001 APL', 'Error', 5000);
            isError = true;
          }
          if (!newValues.walletAddress || !newValues.walletAddress.balances) {
            NotificationManager.error('Please select wallet address', 'Error', 5000);
            isError = true;
          }
          if (+newValues.total > +balance) {
            NotificationManager.error(`You need more ${currency.toUpperCase()}. Please check your wallet balance.`, 'Error', 5000);
            isError = true;
          }
          if (+ethFee > +newValues.walletAddress.balances.eth) {
            NotificationManager.error(`To buy APL you need to have at least ${ethFee.toLocaleString('en', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 9,
            })} ETH on your balance to confirm transaction`, 'Error', 5000);
            isError = true;
          }
          if (isError) {
            setPending(false);
            return;
          }
          const pairRate = Math.round(multiply(newValues.pairRate, ONE_GWEI));
          const offerAmount = multiply(newValues.offerAmount, ONE_GWEI);
          const balanceETH = parseFloat(newValues.walletAddress.balances[currency]);
          const currentBalanceAPL = (dashboardAccoountInfo && dashboardAccoountInfo.unconfirmedBalanceATM)
            ? parseFloat(dashboardAccoountInfo.unconfirmedBalanceATM)
            : parseFloat(balanceAPL);
          const fixedOfferAmount = offerAmount.toFixed();
          const checkFee = currency === 'eth' ? newValues.total + ethFee : ethFee;
          if (checkFee > balanceETH) {
            NotificationManager.error('Not enough founds on your ETH balance. You need to pay Gas fee', 'Error', 5000);
            setPending(false);
            return;
          }
          if (balanceETH === 0 || balanceETH < newValues.total) {
            NotificationManager.error(`Not enough founds on your ${currency.toUpperCase()} balance.`, 'Error', 5000);
            setPending(false);
            return;
          }
          if (!balanceAPL || currentBalanceAPL === 0 || currentBalanceAPL < feeATM) {
            NotificationManager.error('Not enough funds on your APL balance. You need to pay 2 APL fee.', 'Error', 5000);
            setPending(false);
            return;
          }
          const params = {
            offerType: 0, // BUY
            pairCurrency: currencyTypes[currency],
            pairRate,
            offerAmount: fixedOfferAmount,
            sender: account,
            passphrase: passPhrase,
            feeATM,
            walletAddress: newValues.walletAddress.address,
          };
          if (passPhrase) {
            dispatch(createOffer(params)).then(() => {
              setPending(false);
            });
            dispatch(resetTrade());
            setValues({
              walletAddress: newValues.walletAddress,
              pairRate: '',
              offerAmount: '',
              total: '',
            });
          } else {
            dispatch(setBodyModalParamsAction('CONFIRM_CREATE_OFFER', {
              params,
              resetForm: () => {
                dispatch(resetTrade());
                setValues({
                  walletAddress: newValues.walletAddress,
                  pairRate: '',
                  offerAmount: '',
                  total: '',
                });
              },
            }));
            setPending(false);
          }
        } else {
          NotificationManager.error('Price and amount are required', 'Error', 5000);
          setPending(false);
        }
      } else {
        setPending(false);
        handleLoginModal();
      }
    }
  }, [
    isPending, dispatch, setPending, wallet, currency, ethFee, dashboardAccoountInfo,
    balanceAPL, account, passPhrase, setValues, handleLoginModal,
  ]);

  useEffect(() => {
    if (currentCurrency && (currency !== newCurrentCurrency || wallet !== newWallet)) {
      setValues({
        walletAddress: values.walletAddress,
        pairRate: '',
        offerAmount: '',
        total: '',
      });
    }

    const currentWalletsList = (wallet || []).map(currWallet => (
      {
        value: currWallet,
        label: currWallet.address,
      }
    ));

    setNewCurrentCurrency(currency);
    setNewWallet(wallet);
    setWalletsList(currentWalletsList);
  }, [currency, currentCurrency, newCurrentCurrency, newWallet, wallet]);

  useEffect(() => {
    if (infoSelectedBuyOrder) {
      const { pairRate, offerAmount, total } = infoSelectedBuyOrder;
      const balance = wallet && wallet[0].balances[currency];
      const normalizePairRate = !pairRate ? 0 : division(pairRate, ONE_GWEI, 9);
      const normalizeOfferAmount = !offerAmount ? 0 : division(offerAmount, ONE_GWEI, 9);
      const normalizeTotal = !total ? 0 : division(total, Math.pow(10, 18), 9);
      const rangeValue = ((normalizePairRate * normalizeOfferAmount) * 100 / balance).toFixed(0);
      setValues({
        walletAddress: wallet && wallet[0],
        pairRate: normalizePairRate,
        offerAmount: normalizeOfferAmount,
        total: normalizeTotal,
        range: rangeValue === 'NaN' ? 0 : rangeValue > 100 ? 100 : rangeValue,
      });
    }
  }, [currency, infoSelectedBuyOrder, setValues, wallet]);

  const currencyName = currency.toUpperCase();
  let balance = values.walletAddress && values.walletAddress.balances[currency];
  balance = currency === 'eth' ? balance - ethFee : balance;
  balance = balance < 0 ? 0 : balance;


  return (
    <Form className="form-group-app d-flex flex-column justify-content-between h-100 mb-0">
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
            const amount = values.offerAmount || 0;
            let rangeValue = ((amount * price) * 100 / balance).toFixed(0);
            if (rangeValue > 100) rangeValue = 100;
            setFieldValue('offerAmount', amount);
            setFieldValue('range', rangeValue === 'NaN' ? 0 : rangeValue);
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
      <div className="form-group mb-3">
        <CustomInput
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
        </CustomInput>
      </div>
      <div className="form-group mb-3">
        <CustomInput
          name="total"
          label="I will pay"
          type="float"
          placeholder="I will pay"
          disabled
        />
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
