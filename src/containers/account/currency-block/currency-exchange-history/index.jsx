/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAccountRsSelector } from '../../../../selectors';
import { getAccountExchangesAction } from '../../../../actions/exchange-booth';
import { TableLoader } from '../../../components/TableLoader';
import SiteHeader from '../../../components/site-header';
import TradeHistoryItem from './exchange-history-item';

export default function TradeHistoryCurrency() {
  const dispatch = useDispatch();
  const accountRS = useSelector(getAccountRsSelector);

  const getExchanges = useCallback(async ({ firstIndex, lastIndex }) => {
    const exchanges = await dispatch(getAccountExchangesAction({
        account: accountRS,
        firstIndex,
        lastIndex,
        includeCurrencyInfo: true,
      }));

    return exchanges?.exchanges ?? []; 
  }, [dispatch, accountRS]);

  return (
    <div className="page-content">
      <SiteHeader pageTitle="Exchange History" />
      <div className="page-body container-fluid">
        <TableLoader
          headersList={[
            {
              name: 'Date',
              alignRight: false,
            }, {
              name: 'Exchange Request',
              alignRight: false,
            }, {
              name: 'Exchange Offer',
              alignRight: false,
            }, {
              name: 'Code',
              alignRight: false,
            }, {
              name: 'Seller',
              alignRight: false,
            }, {
              name: 'Buyer',
              alignRight: false,
            }, {
              name: 'Units',
              alignRight: true,
            }, {
              name: 'Rate',
              alignRight: true,
            }, {
              name: 'Amount',
              alignRight: true,
            },
          ]}
          TableRowComponent={TradeHistoryItem}
          className="mb-3"
          emptyMessage="No exchange history found."
          dataLoaderCallback={getExchanges}
        />
      </div>
    </div>
  );
}
