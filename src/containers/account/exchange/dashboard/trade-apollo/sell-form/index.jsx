import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import { NotificationManager } from 'react-notifications';
import { currencyTypes, multiply, numberToLocaleString } from '../../../../../../helpers/format';
import { createOffer } from '../../../../../../actions/wallet';
import { ONE_GWEI } from '../../../../../../constants';
import {
  setBodyModalParamsAction, resetTrade, setSelectedOrderInfo,
} from '../../../../../../modules/modals';
import SellForm from './form';

const feeATM = 200000000;

export default function SellFormWrapper(props) {
  const dispatch = useDispatch();

  const { dashboardAccoountInfo } = useSelector(state => state.dashboard);
  const { currentCurrency } = useSelector(state => state.exchange);
  const { unconfirmedBalanceATM: balanceAPL, account, passPhrase } = useSelector(state => state.account);

  const { currency } = currentCurrency;

  const {
    wallet, handleLoginModal, ethFee, ticker, decimals,
  } = props;

  const [isPending, setIsPending] = useState(false);

  const setPending = useCallback((value = true) => setIsPending(value), []);

  const handleFormSubmit = useCallback(async (values) => {
    if (!isPending) {
      const pairRateInfo = multiply(values.pairRate, ONE_GWEI);
      const offerAmountInfo = multiply(values.offerAmount, ONE_GWEI);
      const totalInfo = pairRateInfo * offerAmountInfo;
      dispatch(setSelectedOrderInfo({
        pairRate: pairRateInfo,
        offerAmount: offerAmountInfo,
        total: totalInfo,
        type: 'SELL',
      }));
      setPending();
      if (wallet) {
        if (values.offerAmount > 0 && values.pairRate > 0) {
          let isError = false;
          if (values.pairRate < 0.000000001) {
            NotificationManager.error(`Price must be more then 0.000000001 ${currency.toUpperCase()}`, 'Error', 5000);
            isError = true;
          }
          if (values.offerAmount < 0.001) {
            NotificationManager.error(`You can sell more then 0.001 ${ticker}`, 'Error', 5000);
            isError = true;
          }
          if (+ethFee > +values.walletAddress.value.balances.eth) {
            NotificationManager.error(`To sell ${ticker} you need to have at least ${numberToLocaleString(ethFee, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 9,
            })} ETH on your balance to confirm transaction`, 'Error', 5000);
            isError = true;
          }
          if (isError) {
            dispatch(resetTrade());
            setPending(false);
            return;
          }
          const pairRate = Math.round(multiply(values.pairRate, ONE_GWEI));
          const offerAmount = values.offerAmount * ONE_GWEI;
          const currentBalanceAPL = (dashboardAccoountInfo && dashboardAccoountInfo.unconfirmedBalanceATM)
            ? parseFloat(dashboardAccoountInfo.unconfirmedBalanceATM)
            : parseFloat(balanceAPL);
          if (!currentBalanceAPL || currentBalanceAPL < ((offerAmount + feeATM) / 10)) {
            NotificationManager.error(`Not enough funds on your ${ticker} balance.`, 'Error', 5000);
            setPending(false);
            return;
          }

          const params = {
            offerType: 1, // SELL
            pairCurrency: currencyTypes[currency],
            pairRate,
            offerAmount,
            sender: account,
            passphrase: passPhrase,
            feeATM,
            walletAddress: values.walletAddress.value.address,
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
    account, balanceAPL, currency, dashboardAccoountInfo, dispatch, ticker,
    ethFee, handleLoginModal, isPending, passPhrase, setPending, wallet,
  ]);

  return (
    <Formik
      initialValues={{
        pairRate: '',
        offerAmount: '',
        total: '',
        range: '',
      }}
      onSubmit={handleFormSubmit}
    >
      <SellForm
        wallet={wallet}
        ticker={ticker}
        ethFee={ethFee}
        isPending={isPending}
        currency={currency}
        decimals={decimals}
        dashboardAccoountInfo={dashboardAccoountInfo}
        balanceAPL={balanceAPL}
      />
    </Formik>
  );
}
