import React, {
  useState, useCallback, useEffect,
} from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { getDecimalsSelector, getModalsSelector } from 'selectors';
import { getTransactionFee } from 'actions/wallet';
import { setTypeOfTrade, resetTrade } from 'modules/modals';
import BuyForm from './buy-form';
import SellForm from './sell-form';
import { bigIntDivision, bigIntFormat } from 'helpers/util/bigNumberWrappers';

const feeATM = 200000000;
const ethMinTxFee = 0.002;

export default function TradeApollo({ wallet, handleLoginModal, ticker }) {
  const dispatch = useDispatch();

  const { typeOfTrade } = useSelector(getModalsSelector, shallowEqual);
  const decimals = useSelector(getDecimalsSelector);

  const [maxFee, setMaxFee] = useState();

  const handleGetTransactionFee = useCallback(async () => {
    const transactionFee = await dispatch(getTransactionFee());
    if (transactionFee) {
      setMaxFee(transactionFee.fast);
    }
  }, [dispatch]);

  const changeTabOfTrade = useCallback(currTypeOfTrade => {
    dispatch(setTypeOfTrade(currTypeOfTrade));
    dispatch(resetTrade());
  }, [dispatch]);

  useEffect(() => {
    handleGetTransactionFee();
    dispatch(resetTrade());
  }, [dispatch, handleGetTransactionFee]);

  return (
    <div className="card card-light h-400">
      <div className="card-title">
        <div className="title">Trade Apollo</div>
        <span className="sub-title">
          Fee:
          {bigIntFormat(bigIntDivision(feeATM, decimals))}
          {' '}
          {ticker}
        </span>
      </div>
      <div className="card-body">
        <div className="tabs-wrap mb-3">
          <div
            className={`tab-item ${typeOfTrade === 'BUY' ? 'active' : ''}`}
            onClick={() => changeTabOfTrade('BUY')}
          >
            Buy
            {' '}
            {ticker}
          </div>
          <div
            className={`tab-item ${typeOfTrade === 'SELL' ? 'active' : ''}`}
            onClick={() => changeTabOfTrade('SELL')}
          >
            Sell
            {' '}
            {ticker}
          </div>
        </div>
        {typeOfTrade === 'BUY' ? (
          <BuyForm
            ticker={ticker}
            wallet={wallet}
            handleLoginModal={handleLoginModal}
            ethFee={ethMinTxFee}
          />
        ) : (
          <SellForm
            ticker={ticker}
            decimals={decimals}
            wallet={wallet}
            handleLoginModal={handleLoginModal}
            ethFee={ethMinTxFee}
          />
        )}
      </div>
    </div>
  );
}
