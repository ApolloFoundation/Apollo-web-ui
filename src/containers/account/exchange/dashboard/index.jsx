import React, {
  useCallback, useState, useEffect,
} from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { NotificationManager } from 'react-notifications';
import { setCurrentCurrencyAction } from 'modules/exchange';
import { setBodyModalParamsAction, resetTrade } from 'modules/modals';
import {
  getBuyOpenOffers,
  getCurrencyBalance,
  getMyOpenOffers,
  getPlotBuyOpenOffers,
  getPlotSellOpenOffers,
  getSellOpenOffers,
} from 'actions/wallet';
import TwitterBanner from 'assets/banner-small.png';
import SiteHeader from 'containers/components/site-header';
import InfoBox from 'containers/components/info-box';
import { useExchangeWalletConverts } from 'hooks/useExchangeWalletConverts';
import { readFromLocalStorage } from 'actions/localStorage';
import { getAccountInfoSelector, getExchangeInfoSelector } from 'selectors';
import TradeHistoryExchange from './trade-history';
import TradeApollo from './trade-apollo';
import OpenOrders from './open-orders';
import Orderbook from './orderbook';
import Plot from './plot';

export default function Exchange() {
  const dispatch = useDispatch();
  const { converWallets } = useExchangeWalletConverts();

  const { wallets, ticker } = useSelector(getAccountInfoSelector, shallowEqual);

  const {
    currencies, currentCurrency, buyOrders, sellOrders,
    plotBuyOrders, plotSellOrders, myOrders,
  } = useSelector(getExchangeInfoSelector, shallowEqual);

  const [currWallets, setCurrWallets] = useState(null);

  const handleGetCurrencyBalance = useCallback(async selectWallets => {
    const params = converWallets(selectWallets);

    const walletsBalances = await dispatch(getCurrencyBalance(params));

    if (walletsBalances) {
      setCurrWallets(walletsBalances);
    }
  }, [dispatch, converWallets]);

  const handleLoginModal = useCallback(() => {
    dispatch(setBodyModalParamsAction('LOGIN_EXCHANGE', {}));
  }, [dispatch]);

  const switchCurrency = useCallback(currency => {
    dispatch(resetTrade());
    dispatch(setCurrentCurrencyAction(currency));
    dispatch(getBuyOpenOffers(currency));
    dispatch(getSellOpenOffers(currency));
    dispatch(getPlotBuyOpenOffers(currency));
    dispatch(getPlotSellOpenOffers(currency));
    dispatch(getMyOpenOffers(currency));
  }, [dispatch]);

  useEffect(() => {
    NotificationManager.info(`After creating an order, you should keep your node online, leaving enough funds on your account to cover the exchange fees (min 12 ${ticker}), until the exchange completes`, null, 1000000);
    const newWallets = readFromLocalStorage('wallets');
    if (!newWallets) {
      handleLoginModal();
    } else {
      handleGetCurrencyBalance(JSON.parse(newWallets));
    }
    dispatch(getBuyOpenOffers());
    dispatch(getSellOpenOffers());
    dispatch(getPlotBuyOpenOffers());
    dispatch(getPlotSellOpenOffers());
    dispatch(getMyOpenOffers());
  }, []);

  useEffect(() => {
    if (!currWallets && wallets) {
      handleGetCurrencyBalance(wallets);
    }
  }, [currWallets, handleGetCurrencyBalance, wallets]);

  const currWallet = currWallets && currWallets.eth;
  const buyOrdersCurrency = buyOrders[currentCurrency.currency];
  const sellOrdersCurrency = sellOrders[currentCurrency.currency];
  const plotBuyOrdersCurrency = plotBuyOrders[currentCurrency.currency];
  const plotSellOrdersCurrency = plotSellOrders[currentCurrency.currency];

  return (
    <div className="page-content">
      <SiteHeader
        pageTitle="Decentralized Exchange"
      />
      <div className="page-body exchange">
        <div className="container-fluid p-0">
          <div className="cards-wrap row">
            <div className="col-md-12 p-0">
              <InfoBox info>
                Welcome to the Beta version of the Apollo DEX, more functions are to follow.
              </InfoBox>
            </div>
          </div>
          <div className="cards-wrap row">
            <div className="col-md-9 col-sm-7 p-0 tradingview">
              <div className="row">
                <div className="col-md-8 col-sm-12 p-0 tv-chart">
                  <Plot
                    ticker={ticker}
                    currentCurrency={currentCurrency}
                    buyOrders={plotBuyOrdersCurrency}
                    sellOrders={plotSellOrdersCurrency}
                    currencies={currencies}
                    switchCurrency={switchCurrency}
                    wallet={currWallet}
                    handleLoginModal={handleLoginModal}
                  />
                </div>
                <div className="col-md-4 col-sm-12 p-0 trade">
                  <TradeApollo
                    ticker={ticker}
                    currentCurrency={currentCurrency}
                    wallet={currWallet}
                    handleLoginModal={handleLoginModal}
                  />
                </div>
                <div className="col-md-3 col-sm-5 p-0 order-book">
                  <div className="d-flex flex-column h-100">
                    <Orderbook
                      ticker={ticker}
                      currentCurrency={currentCurrency}
                      buyOrders={buyOrdersCurrency}
                      sellOrders={sellOrdersCurrency}
                    />
                  </div>
                </div>
              </div>
              <div className="row bottom">
                <div className="col-md-4 col-sm-12 p-0">
                  <TradeHistoryExchange
                    ticker={ticker}
                    currentCurrency={currentCurrency}
                    wallet={currWallet}
                    handleLoginModal={handleLoginModal}
                  />
                </div>
                <div className="col-md-4 col-sm-6 p-0">
                  <OpenOrders
                    ticker={ticker}
                    currentCurrency={currentCurrency}
                    handleLoginModal={handleLoginModal}
                    myOrders={myOrders[currentCurrency.currency]}
                  />
                </div>
                <div className="col-md-4 col-sm-6 p-0">
                  <div className="wrap-card-square">
                    <a
                      href="https://twitter.com/aplfintech"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="card card-square"
                      style={{ backgroundImage: `url(${TwitterBanner})` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
