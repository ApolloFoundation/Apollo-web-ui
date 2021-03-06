import React, { useState, useCallback } from 'react';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import { NotificationManager } from 'react-notifications';
import { currencyTypes, multiply } from '../../../../../../helpers/format';
import { createOffer } from '../../../../../../actions/wallet';
import { ONE_GWEI } from '../../../../../../constants';
import {
  setBodyModalParamsAction, resetTrade, setSelectedOrderInfo,
} from '../../../../../../modules/modals';
import BuyForm from './form';
import store from '../../../../../../store';

const feeATM = 200000000;

function BuyFormWrapper(props) {
  const { dispatch } = store;

  const {
    wallet, handleLoginModal, ethFee, ticker, currentCurrency, dashboardAccoountInfo, accountInfo,
  } = props;
  
  const { currency } = currentCurrency;
  const { unconfirmedBalanceATM: balanceAPL, account, passPhrase } = accountInfo;

  const [isPending, setIsPending] = useState(false);

  const setPending = useCallback((value = true) => { setIsPending(value); }, []);

  const handleFormSubmit = useCallback( async (newValues) => {
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
          const balance = newValues.walletAddress
            && newValues.walletAddress.value.balances[currency];
          let isError = false;
          if (+newValues.pairRate < 0.000000001) {
            NotificationManager.error(`Price must be more then 0.000000001 ${currency.toUpperCase()}`, 'Error', 5000);
            isError = true;
          }
          if (+newValues.offerAmount < 0.001) {
            NotificationManager.error(`You can buy more then 0.001 ${ticker}`, 'Error', 5000);
            isError = true;
          }
          if (!newValues.walletAddress || !newValues.walletAddress.value.balances) {
            NotificationManager.error('Please select wallet address', 'Error', 5000);
            isError = true;
          }
          if (+newValues.total > +balance) {
            NotificationManager.error(`You need more ${currency.toUpperCase()}. Please check your wallet balance.`, 'Error', 5000);
            isError = true;
          }
          if (+ethFee > +newValues.walletAddress.value.balances.eth) {
            NotificationManager.error(`To buy ${ticker} you need to have at least ${ethFee.toLocaleString('en', {
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
          const offerAmount = +multiply(newValues.offerAmount, ONE_GWEI);
          const balanceETH = parseFloat(newValues.walletAddress.value.balances[currency]);
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
            NotificationManager.error(`Not enough funds on your ${ticker} balance. You need to pay 2 ${ticker} fee.`, 'Error', 5000);
            setPending(false);
            return;
          }

          const params = {
            offerType: 0, // BUY
            pairCurrency: currencyTypes[currency],
            pairRate,
            offerAmount: fixedOfferAmount,
            sender: account,
            feeATM,
            walletAddress: newValues.walletAddress.value.address,
            passphrase: passPhrase,
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
    isPending, dispatch, setPending, wallet, currency, ethFee, ticker,
    dashboardAccoountInfo, balanceAPL, account, passPhrase, handleLoginModal,
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
      <BuyForm
        passPhrase={passPhrase}
        wallet={wallet}
        ticker={ticker}
        ethFee={ethFee}
        isPending={isPending}
      />
    </Formik>
  );
}

const mapStateToProps = (state) => ({
  dashboardAccoountInfo: state.dashboard.dashboardAccoountInfo,
  currentCurrency: state.exchange.currentCurrency,
  accountInfo: state.account,
});

export default connect(mapStateToProps)(BuyFormWrapper);