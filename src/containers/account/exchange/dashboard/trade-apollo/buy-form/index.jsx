import React, {
  useEffect, useState, useCallback,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Formik, Form, useFormik, withFormik, FormikContext, FormikProvider,
} from 'formik';
import cn from 'classnames';
import { NotificationManager } from 'react-notifications';
import {
  currencyTypes, multiply, division,
} from '../../../../../../helpers/format';
import {
  setBodyModalParamsAction, resetTrade, setSelectedOrderInfo,
} from '../../../../../../modules/modals';
import { ReactComponent as ArrowRight } from '../../../../../../assets/arrow-right.svg';
import { createOffer } from '../../../../../../actions/wallet';
import { ONE_GWEI } from '../../../../../../constants';
import BuyForm from './form';
import InputForm from '../../../../../components/input-form';
import CustomInput from '../../../../../components/custom-input';
import Button from '../../../../../components/button';
import CustomSelect from '../../../../../components/select';
import InputRange from '../../../../../components/input-range';
import NumericInput from '../../../../../components/form-components/numeric-input1';
import getFullNumber from '../../../../../../helpers/util/expancionalParser';

const feeATM = 200000000;

export default function BuyFormWrapper(props) {
  const dispatch = useDispatch();
  const { currentCurrency } = useSelector(state => state.exchange);
  const { dashboardAccoountInfo } = useSelector(state => state.dashboard);
  const { unconfirmedBalanceATM: balanceAPL, account, passPhrase } = useSelector(state => state.account);

  const { currency } = currentCurrency;

  const { wallet, handleLoginModal, ethFee } = props;

  const [isPending, setIsPending] = useState(false);
  const [newCurrentCurrency, setNewCurrentCurrency] = useState(null);
  const [newWallet, setNewWallet] = useState(null);
  const [walletsList, setWalletsList] = useState(null);

  const setPending = useCallback((value = true) => { setIsPending(value); }, []);

  const handleFormSubmit = useCallback(newValues => {
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
          } else {
            dispatch(setBodyModalParamsAction('CONFIRM_CREATE_OFFER', {
              params,
              resetForm: () => {
                dispatch(resetTrade());
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
    isPending, dispatch, setPending, wallet, currency, ethFee,
    dashboardAccoountInfo, balanceAPL, account, passPhrase, handleLoginModal,
  ]);

  useEffect(() => {
    // !NEED to check
    // if (currentCurrency && (currency !== newCurrentCurrency || wallet !== newWallet)) {
    //   setValues({
    //     walletAddress: values.walletAddress,
    //     pairRate: '',
    //     offerAmount: '',
    //     total: '',
    //   });
    // }

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

  return (
    <Formik
      initialValues={{
        walletAddress: walletsList && walletsList[0],
        pairRate: '',
        offerAmount: '',
        total: '',
        range: '',
      }}
      onSubmit={handleFormSubmit}
    >
      <BuyForm
        wallet={wallet}
        ethFee={ethFee}
        walletsList={walletsList}
        isPending={isPending}
      />
    </Formik>
  );
}
