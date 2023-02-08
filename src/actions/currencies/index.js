/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import axios from 'axios';
import config from '../../config';
import cancelAxiosRequest from '../../helpers/cancelToken'; 

export function getAliasesAction(reqParams) {
  return () => axios.get(config.api.serverUrl, {
    params: {
      requestType: 'getAliases',
      ...reqParams,
    },
  })
    .then(res => {
      if (!res.data.errorCode) {
        return res.data;
      }
    })
    .catch(err => {
      console.log(err);
    });
}

export function getAllCurrenciesAction(reqParams) {
  return () => axios.get(config.api.serverUrl, {
    params: {
      requestType: 'getAllCurrencies',
      includeCurrencyInfo: true,
      ...reqParams,
    },
  })
    .then(res => {
      if (!res.data.errorCode) {
        return res.data;
      }
    })
    .catch(err => {
      console.log(err);
    });
}

export function getAccountCurrenciesAction(reqParams) {
  return () => axios.get(config.api.serverUrl, {
    params: {
      requestType: 'getAccountCurrencies',
      includeCurrencyInfo: true,
      ...reqParams,
    },
    cancelToken: cancelAxiosRequest.token,
  })
    .then(res => {
      if (!res.data.errorCode) {
        return res.data;
      }
    })
    .catch(err => {
      console.log(err);
    });
}

export function getCurrencyAction(reqParams) {
  return () => axios.get(config.api.serverUrl, {
    params: {
      requestType: 'getCurrency',
      ...reqParams,
    },
  })
    .then(res => {
      if (!res.data.errorCode) {
        return res.data;
      }
    })
    .catch(err => {
      console.log(err);
    });
}

export function getTransferHistory(reqParams) {
  return () => axios.get(config.api.serverUrl, {
    params: {
      requestType: 'getCurrencyTransfers',
      includeCurrencyInfo: true,
      random: 0.004660718106320294,
      ...reqParams,
    },
  })
    .then(res => {
      if (!res.data.errorCode) {
        return res.data;
      }
    })
    .catch(err => {
      console.log(err);
    });
}

export const getExchangesByExchangeRequest = reqParams => () => axios.get(config.api.serverUrl, {
  params: {
    requestType: 'getExchangesByExchangeRequest',
    ...reqParams,
  },
})
  .then(res => {
    if (res.data) {
      return res.data;
    }
  });

export const getExchangesByOfferRequest = reqParams => () => axios.get(config.api.serverUrl, {
  params: {
    requestType: 'getExchangesByOffer',
    ...reqParams,
  },
})
  .then(res => {
    if (res.data) {
      return res.data;
    }
  });

export const getOfferRequest = reqParams => () => axios.get(config.api.serverUrl, {
  params: {
    requestType: 'getOffer',
    ...reqParams,
  },
})
  .then(res => {
    if (res.data) {
      return res.data;
    }
  });
