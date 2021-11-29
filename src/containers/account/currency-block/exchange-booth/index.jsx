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
import { setBodyModalParamsAction } from '../../../../modules/modals';
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

export default function ExchangeBooth() {
  const dispatch = useDispatch();

  const {
    balanceATM, accountRS, decimals, ticker,
  } = useSelector(state => state.account);

  const [minimumBuyRate, setMinimumBuyRate] = useState(null);
  const [minimumSellRate, setMinimumSellRate] = useState(null);
  const [dataCurrencies, setDataCurrencies] = useState(null);
  const [dataAccountCurrency, setDataAccountCurrency] = useState(null);
  const [currencyInfo, setCurrencyInfo] = useState(null);

  const currentCurrency = currencyInfo && currencyInfo.currency;

  const match = useRouteMatch();
  const history = useHistory();

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
    // ! need check, for what need setState
    // this.setState({ asset: null }, () => {
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
          <>
            <button
              type="button"
              onClick={() => dispatch(setBodyModalParamsAction('OFFER_CURRENCY', currencyInfo))}
              className="btn btn-green btn-sm"
            >
              Offer
            </button>
            <button
              type="button"
              onClick={() => dispatch(setBodyModalParamsAction('TRANSFER_CURRENCY', currencyInfo))}
              style={{ marginLeft: 15 }}
              className="btn btn-green btn-sm"
            >
              Transfer
            </button>
              {(window.innerWidth < 767 && isGoBack) && (
                <button
                  type="button"
                  className="btn btn-default btn-sm ml-3"
                  onClick={goBack}
                >
                  <i className="zmdi zmdi-long-arrow-left" />
                  &nbsp;&nbsp;
                  Back to list
                </button>
              )}
          </>
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
                    <ExchangeRequestsTable
                      account={accountRS}
                      currencyInfo={currencyInfo}
                    />
                    <ExecutedExcahngeTable
                      currencyInfo={currencyInfo}
                    />
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
