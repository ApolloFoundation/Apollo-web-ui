import React, {
  useState, useCallback, useEffect,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTransactionFee } from '../../../../../actions/wallet';
import { setTypeOfTrade, resetTrade } from '../../../../../modules/modals';
import BuyForm from './buy-form';
import SellForm from './sell-form';

const feeATM = 200000000;
const ethMinTxFee = 0.002;

export default function TradeApollo(props) {
  const dispatch = useDispatch();

  const { typeOfTrade } = useSelector(state => state.modals);
  const { decimals } = useSelector(state => state.account);

  const { wallet, handleLoginModal, ticker } = props;

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
          {feeATM / decimals}
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
