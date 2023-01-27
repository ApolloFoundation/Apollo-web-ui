/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTradesHistoryAction } from 'actions/assets';
import SiteHeader from 'containers/components/site-header';
import { TableLoader } from 'containers/components/TableLoader';
import { getAccountRsSelector } from 'selectors';
import TradeHistoryItem from './trade-history-item';

export default function TradeHistory() {
  const dispatch = useDispatch();
  const accountRS = useSelector(getAccountRsSelector);

  const getTradesHistory = useCallback(async ({ firstIndex, lastIndex }) => {
     const res = await dispatch(getTradesHistoryAction({
      firstIndex,
      lastIndex,
      account: accountRS,
    }));
    return res.trades;
  }, [dispatch, accountRS]);

  return (
    <div className="page-content">
      <SiteHeader pageTitle="Trade History" />
      <div className="page-body container-fluid">
        <TableLoader
          headersList={[
            {
              name: 'Asset',
              alignRight: false,
            }, {
              name: 'Date',
              alignRight: false,
            }, {
              name: 'Type',
              alignRight: false,
            }, {
              name: 'Quantity',
              alignRight: true,
            }, {
              name: 'Price',
              alignRight: true,
            }, {
              name: 'Total',
              alignRight: true,
            }, {
              name: 'Buyer',
              alignRight: false,
            }, {
              name: 'Seller',
              alignRight: false,
            },
          ]}
          className="mb-3"
          emptyMessage="No trade history available."
          TableRowComponent={TradeHistoryItem}
          dataLoaderCallback={getTradesHistory}
        />
      </div>
    </div>
  );
}
