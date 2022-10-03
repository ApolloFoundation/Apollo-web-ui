/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, {
  useEffect, useCallback, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { getAllCurrenciesAction, getCurrencyAction } from '../../../../actions/currencies';
import { BlockUpdater } from '../../../block-subscriber';
import { getAccountInfoSelector } from '../../../../selectors';
// Forms
import BuyForm from './forms/buy-form';
import SellForm from './forms/sell-form';
// Tables
import OffersToBuyTable from './tables/offers-to-buy-table';
import OffersToSellTable from './tables/offers-to-sell-table';
import ExchangeRequestsTable from './tables/exchange-requests-table';
import ExecutedExcahngeTable from './tables/executed-exchange-table';
import SiteHeader from '../../../components/site-header';
import SidebarList from '../../../components/sidebar-list';
import SidebarCurrency from './sdiebar-item';
import CurrencyInfoTable from './currency-info';
import { CurrencyButtonMenu } from './CurrencyButtonMenu';

export default function ExchangeBooth() {
  const dispatch = useDispatch();
  const {
    balanceATM, accountRS, decimals, ticker,
  } = useSelector(getAccountInfoSelector);
  const match = useRouteMatch();
  const history = useHistory();

  const [minimumBuyRate, setMinimumBuyRate] = useState(null);
  const [minimumSellRate, setMinimumSellRate] = useState(null);
  const [dataCurrencies, setDataCurrencies] = useState(null);
  const [dataAccountCurrency, setDataAccountCurrency] = useState(null);
  const [currencyInfo, setCurrencyInfo] = useState(null);

  const currentCurrency = currencyInfo && currencyInfo.currency;

  const getCurrencies = useCallback(async reqParams => {
    const allCurrencies = await dispatch(getAllCurrenciesAction(reqParams));

    if (allCurrencies) {
      setDataCurrencies(allCurrencies.currencies);
    }
  }, [dispatch]);

  const getAccountCurrency = useCallback(async reqParams => {
    const accountCurrency = await dispatch(getCurrencyAction(reqParams));

    if (accountCurrency) {
      const newAccountCurrency = accountCurrency.accountCurrencies
        .find(el => el.code === match.params.currency);
      setDataAccountCurrency(newAccountCurrency);
    }
  }, [dispatch, match.params.currency]);

  const getCurrency = useCallback(async currentCode => {
    const currency = await dispatch(getCurrencyAction(currentCode));

    if (currency) {
      setCurrencyInfo(currency);
    }
  }, [dispatch]);

  const listener = useCallback(() => {
    if (currentCurrency) {
      getAccountCurrency({
        requestType: 'getAccountCurrencies',
        account: accountRS,
        includeCurrencyInfo: true,
        // currency: currentCurrency,
      });
    }

    getCurrency({ code: match.params.currency });
    getCurrencies();
  }, [
    accountRS, currentCurrency, getAccountCurrency,
    getCurrencies, getCurrency, match.params.currency,
  ]);

  useEffect(() => {
    getAccountCurrency({
      requestType: 'getAccountCurrencies',
      account: accountRS,
      includeCurrencyInfo: true,
      code: match.params.currency,
    });
    getCurrency({ code: match.params.currency });
    getCurrencies();
  }, [
    accountRS, getAccountCurrency,
    getCurrencies, getCurrency, match.params.currency,
  ]);

  const goBack = useCallback(() => {
    history.push('/currencies');
  }, [history]);

  useEffect(() => {
    BlockUpdater.on('data', listener);

    return () => BlockUpdater.removeListener('data', listener);
  }, [listener]);

  const isGoBack = !!Object.values(match.params).length;
  const balanceBuy = Math.round(balanceATM / decimals);
  const balanceSell = (!!dataAccountCurrency && !!dataAccountCurrency.unconfirmedUnits)
    ? (dataAccountCurrency.unconfirmedUnits / (10 ** dataAccountCurrency.decimals))
    : 0;

  return (
    <div className="page-content">
      <SiteHeader pageTitle="Exchange booth">
        {dataCurrencies && (
          <CurrencyButtonMenu isGoBack={isGoBack} goBack={goBack} currencyInfo={currencyInfo} />
        )}
      </SiteHeader>
      <div className="page-body container-fluid exchange-booth">
        <div className="row">
          {currencyInfo && <CurrencyInfoTable {...currencyInfo} />}
          <div className="col-md-9 col-sm-8 p-0">
            {(window.innerWidth > 767 || isGoBack) && (
              <>
                {(dataCurrencies && currencyInfo) && (
                  <div className="row">
                    <BuyForm
                      ticker={ticker}
                      currentCoinDecimals={decimals}
                      minimumSellRate={minimumSellRate}
                      currencyInfo={currencyInfo}
                      balanceBuy={balanceBuy}
                    />
                    <SellForm
                      ticker={ticker}
                      currentCoinDecimals={decimals}
                      currencyInfo={currencyInfo}
                      minimumBuyRate={minimumBuyRate}
                      balanceSell={balanceSell}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-md-3 col-sm-4 p-0 mb-3">
            {(window.innerWidth > 767 || !isGoBack) && (
              <SidebarList
                element="code"
                baseUrl="/exchange-booth/"
                data={dataCurrencies}
                emptyMessage="No currencies found."
                Component={SidebarCurrency}
              />
            )}
          </div>
          <div className="col-md-9 col-sm-8 p-0">
            {(window.innerWidth > 767 || isGoBack) && (
              <>
                {(dataCurrencies && currencyInfo) && (
                  <div className="row">
                    <div className="col-md-12 p-0">
                      <div className="row">
                        <OffersToBuyTable
                          setMinimumBuyRate={setMinimumBuyRate}
                          currencyInfo={currencyInfo}
                        />
                        <OffersToSellTable
                          currencyInfo={currencyInfo}
                          setMinimumSellRate={setMinimumSellRate}
                        />
                      </div>
                    </div>
                    <ExchangeRequestsTable account={accountRS} currencyInfo={currencyInfo} />
                    <ExecutedExcahngeTable currencyInfo={currencyInfo} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
