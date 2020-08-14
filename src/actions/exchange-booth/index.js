/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import axios from 'axios';
import config from '../../config';

export const getBuyOffersAction = reqParams => () => axios.get(config.api.serverUrl, {
  params: {
    requestType: 'getBuyOffers',
    availableOnly: true,
    random: Math.random(),
    ...reqParams,
  },
}).then(res => {
  if (!res.data.errorCode) {
    return res.data;
  }
});

export const getSellOffersAction = reqParams => () => axios.get(config.api.serverUrl, {
  params: {
    requestType: 'getSellOffers',
    availableOnly: true,
    random: Math.random(),
    ...reqParams,
  },
}).then(res => {
  if (!res.data.errorCode) {
    return res.data;
  }
});

export const getAccountExchangeAction = reqParams => () => axios.get(config.api.serverUrl, {
  params: {
    requestType: 'getAccountExchangeRequests',
    random: Math.random(),
    ...reqParams,
  },
}).then(res => {
  if (!res.data.errorCode) {
    return res.data;
  }
});

export const getExchangesAction = reqParams => () => axios.get(config.api.serverUrl, {
  params: {
    requestType: 'getExchanges',
    includeCurrencyInfo: true,
    random: Math.random(),
    ...reqParams,
  },
}).then(res => {
  if (!res.data.errorCode) {
    return res.data;
  }
});

export const getAccountExchangesAction = reqParams => () => axios.get(config.api.serverUrl, {
  params: {
    requestType: 'getExchanges',
    ...reqParams,
    random: Math.random(),
  },
}).then(res => {
  if (!res.data.errorCode) {
    return res.data;
  }
});
