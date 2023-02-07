/** ****************************************************************************
 * Copyright © 2019 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import { NotificationManager } from 'react-notifications';
import config from 'config';
import { writeToLocalStorage } from 'actions/localStorage';
import { getAccountInfoAction } from 'actions/account';
import { setWallets } from 'modules/account';
import {
  setBuyOrdersAction,
  setSellOrdersAction,
  setPlotBuyOrdersAction,
  setPlotSellOrdersAction,
  setMyOrdersAction,
  setMyTradeHistoryAction,
  setMyOrderHistoryAction,
  setContractStatus,
  setAllContractStatus,
} from 'modules/exchange';
import {
  handleFetch, GET, POST,
} from 'helpers/fetch';
import { currencyTypes } from 'helpers/format';
import { dashboardAccountInfoAction } from 'modules/dashboard';

export function getWallets(requestParams) {
  return dispatch => handleFetch(`${config.api.server}/rest/keyStore/accountInfo`, POST, requestParams)
    .then(async res => {
      if (!res.errorCode) {
        dispatch(setWallets(res));
        writeToLocalStorage('wallets', res);
        return res;
      }
      NotificationManager.error(res.errorDescription, 'Error', 5000);
    })
    .catch(() => {
      NotificationManager.error('Secret Phrase is incorrect or you not in Vault Wallet.', 'Error', 5000);
    });
}

export function getContractStatus(requestParams) {
  return (dispatch, getState) => {
    if (!requestParams.accountId) {
      const { account } = getState().account;
      requestParams.accountId = account;
    }
    return handleFetch(`${config.api.server}/rest/dex/contracts`, GET, requestParams)
      .then(res => {
        if (!res.errorCode) {
          dispatch(setContractStatus(res));
          return res;
        }
        NotificationManager.error(res.errorDescription, 'Error', 5000);
      })
      .catch(() => {

      });
  };
}

export function getAllContractStatus(requestParams) {
  return (dispatch, getState) => {
    if (!requestParams.accountId) {
      const { account } = getState().account;
      requestParams.accountId = account;
    }
    return handleFetch(`${config.api.server}/rest/dex/all-contracts`, GET, requestParams)
      .then(res => {
        if (!res.errorCode) {
          dispatch(setAllContractStatus(res));
          return res;
        }
        NotificationManager.error(res.errorDescription, 'Error', 5000);
      })
      .catch(() => {

      });
  };
}

export function logout(requestParams) {
  return () => handleFetch(`${config.api.server}/rest/dex/flush`, GET, requestParams)
    .then(res => {
      if (res.errorCode) {
        NotificationManager.error(res.errorDescription, 'Error', 5000);
      }

      return res;
    })
    .catch(() => {});
}

export function getCurrencyBalance(requestParams) {
  return () => handleFetch(`${config.api.server}/rest/dex/balance`, GET, requestParams)
    .then(res => {
      if (!res.errorCode) {
        return res;
      }

      NotificationManager.error(res.errorDescription, 'Error', 5000);
    })
    .catch(() => {});
}

export function walletWithdraw(requestParams) {
  return () => handleFetch(`${config.api.server}/rest/dex/withdraw`, POST, requestParams)
    .then(async res => {
      if (!res.errorCode) {
        return res;
      }

      NotificationManager.error(res.errorDescription, 'Error', 5000);
    })
    .catch(() => {});
}

export const updateOfferInfo = params => async dispatch => {
  dispatch(getBuyOpenOffers());
  dispatch(getSellOpenOffers());
  dispatch(getPlotBuyOpenOffers());
  dispatch(getPlotSellOpenOffers());
  dispatch(getMyOpenOffers());
  const accountInfo = await dispatch(getAccountInfoAction({ account: params.sender }));
  dispatch(dashboardAccountInfoAction(accountInfo));
};

export function createOffer(requestParams) {
  const params = {
    ...requestParams,
    amountOfTime: 86400,
  };
  return dispatch => handleFetch(`${config.api.server}/rest/dex/offer`, POST, params)
    .then(async res => {
      if (!res.errorCode) {
        NotificationManager.success('Your offer has been created!', null, 5000);
        setTimeout(() => {
          dispatch(updateOfferInfo(params));
        }, 10000);
        return res;
      }
      NotificationManager.error(res.errorDescription, 'Error', 5000);
      return null;
    })
    .catch(() => {

    });
}

export function cancelOffer(requestParams) {
  return dispatch => handleFetch(`${config.api.server}/rest/dex/offer/cancel`, POST, requestParams)
    .then(async res => {
      if (!res.errorCode) {
        NotificationManager.success('Your offer has been canceled!', null, 5000);
        setTimeout(() => {
          dispatch(updateOfferInfo(requestParams));
        }, 10000);
        return res;
      }
      NotificationManager.error(res.errorDescription, 'Error', 5000);
    })
    .catch(() => {

    });
}

export function getOrderById(orderId) {
  return () => handleFetch(`${config.api.server}/rest/dex/orders/${orderId}`, GET, null)
    .then(async res => {
      if (!res.errorCode) {
        return res;
      }
      return null;
    })
    .catch(() => {

    });
}

export function getOpenOrders(requestParams) {
  return () => handleFetch(`${config.api.server}/rest/dex/offers`, GET, requestParams)
    .then(async res => {
      if (!res.errorCode) {
        return res;
      }
      NotificationManager.error(res.errorDescription, 'Error', 5000);
    })
    .catch(() => {

    });
}

export const getBuyOpenOffers = (currency, options) => async (dispatch, getState) => {
  const { currentCurrency, buyOrdersPagination } = getState().exchange;
  if (!currency) currency = currentCurrency.currency;
  const params = {
    orderType: 0,
    pairCurrency: currencyTypes[currency],
    isAvailableForNow: true,
    status: 0,
    hasFrozenMoney: true,
    sortBy: 'PAIR_RATE',
    sortOrder: 'DESC',
    ...buyOrdersPagination,
    ...options,
  };
  const buyOrders = await dispatch(getOpenOrders(params));
  dispatch(setBuyOrdersAction(currency, buyOrders, options));
};

export const getSellOpenOffers = (currency, options) => async (dispatch, getState) => {
  const { currentCurrency, sellOrdersPagination } = getState().exchange;
  if (!currency) currency = currentCurrency.currency;
  const params = {
    orderType: 1,
    pairCurrency: currencyTypes[currency],
    isAvailableForNow: true,
    status: 0,
    hasFrozenMoney: true,
    sortBy: 'PAIR_RATE',
    sortOrder: 'DESC',
    ...sellOrdersPagination,
    ...options,
  };
  const sellOrders = await dispatch(getOpenOrders(params));
  dispatch(setSellOrdersAction(currency, sellOrders, options));
};

export const getPlotBuyOpenOffers = (currency) => async (dispatch, getState) => {
  if (!currency) currency = getState().exchange.currentCurrency.currency;
  const params = {
    orderType: 0,
    pairCurrency: currencyTypes[currency],
    isAvailableForNow: true,
    status: 0,
    hasFrozenMoney: true,
    sortBy: 'PAIR_RATE',
    sortOrder: 'DESC',
  };
  const buyOrders = await dispatch(getOpenOrders(params));
  dispatch(setPlotBuyOrdersAction(currency, buyOrders));
};

export const getPlotSellOpenOffers = (currency) => async (dispatch, getState) => {
  if (!currency) currency = getState().exchange.currentCurrency.currency;
  const params = {
    orderType: 1,
    pairCurrency: currencyTypes[currency],
    isAvailableForNow: true,
    status: 0,
    hasFrozenMoney: true,
    sortBy: 'PAIR_RATE',
    sortOrder: 'DESC',
  };
  const sellOrders = await dispatch(getOpenOrders(params));
  dispatch(setPlotSellOrdersAction(currency, sellOrders));
};

export const getAllMyOpenOffers = (currency, options) => async (dispatch, getState) => {
  if (!currency) currency = getState().exchange.currentCurrency.currency;
  const { account } = getState().account;
  const paramsOpenOrder = {
    pairCurrency: currencyTypes[currency],
    accountId: account,
    isAvailableForNow: true,
    status: 0,
    hasFrozenMoney: true,
    ...options,
  };

  const openOrders = await dispatch(getOpenOrders(paramsOpenOrder));
  const orders = openOrders ? [...openOrders].sort((a, b) => b.finishTime - a.finishTime) : [];
  dispatch(setMyOrdersAction(currency, orders));
};

export const getMyTradeHistory = (currency, options) => async (dispatch, getState) => {
  const currentCurrency = currency === null ? null : (currency || getState().exchange.currentCurrency.currency);
  const { account } = getState().account;
  const paramsOpenOrder = {
    accountId: account,
    status: 5,
    sortBy: 'DB_ID',
    sortOrder: 'DESC',
    ...options,
  };

  const currentParamsOpenOrder = currentCurrency ? { ...paramsOpenOrder, pairCurrency: currencyTypes[currentCurrency] } : paramsOpenOrder;

  const openOrders = await dispatch(getOpenOrders(currentParamsOpenOrder));
  const orders = openOrders ? [...openOrders].sort((a, b) => b.finishTime - a.finishTime) : [];
  dispatch(setMyTradeHistoryAction(currentCurrency || 'allTrades', orders));
  return orders;
};

export const getMyOpenOffers = currency => async (dispatch, getState) => {
  if (!currency) currency = getState().exchange.currentCurrency.currency;
  const { account } = getState().account;
  const paramsSell = {
    pairCurrency: currencyTypes[currency],
    accountId: account,
    isAvailableForNow: true,
    orderType: 1,
    status: 0,
    hasFrozenMoney: true,
    sortBy: 'DB_ID',
    sortOrder: 'DESC',
  };
  const paramsBuy = {
    pairCurrency: currencyTypes[currency],
    accountId: account,
    isAvailableForNow: true,
    orderType: 0,
    status: 0,
    hasFrozenMoney: true,
    sortBy: 'DB_ID',
    sortOrder: 'DESC',
  };
  const sellOrders = await dispatch(getOpenOrders(paramsSell));
  const buyOrders = await dispatch(getOpenOrders(paramsBuy));
  const orders = sellOrders && buyOrders ? [...sellOrders, ...buyOrders].sort((a, b) => b.finishTime - a.finishTime) : [];
  dispatch(setMyOrdersAction(currency, orders));
};

export const getMyOfferHistory = options => async (dispatch, getState) => {
  const { account } = getState().account;
  const params = {
    accountId: account,
    sortBy: 'DB_ID',
    sortOrder: 'DESC',
    ...options,
  };
  const orders = await dispatch(getOpenOrders(params));
  dispatch(setMyOrderHistoryAction(orders));
};

export function getTransactionFee() {
  return () => handleFetch(`${config.api.server}/rest/dex/ethInfo`, GET, null, )
    .then(async res => {
      if (!res.errorCode) {
        return res;
      }
      NotificationManager.error(res.errorDescription, 'Error', 5000);
    })
    .catch(() => {

    });
}

export function getIdaxPair(requestParams) {
  return () => handleFetch('https://openapi.idax.pro/api/v2/ticker', GET, requestParams)
    .then(res => {
      if (res && res.ticker) {
        return res.ticker;
      }
      NotificationManager.error('IDAX not working now.', 'Error', 5000);
    })
    .catch(() => {

    });
}

export function exportWallet(requestParams) {
  return () => handleFetch(`${config.api.server}/rest/keyStore/eth`, POST, requestParams, )
    .then(async res => {
      if (!res.errorCode) {
        return res;
      }
      NotificationManager.error(res.errorDescription, 'Error', 5000);
      return null;
    })
    .catch(() => {

    });
}
