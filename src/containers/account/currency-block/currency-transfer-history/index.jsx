/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAccountRsSelector } from 'selectors';
import { TableLoader } from 'containers/components/TableLoader';
import { getTransferHistory } from 'actions/currencies';
import SiteHeader from 'containers/components/site-header';
import TransferHistoryItem from './transfer-history-item';

export default function TransferHistoryCurrency() {
  const dispatch = useDispatch();
  const accountRS = useSelector(getAccountRsSelector);

  const getAssets = useCallback(async ({ firstIndex, lastIndex }) => {
    const newTransfers = await dispatch(getTransferHistory({
      account: accountRS,
      firstIndex,
      lastIndex
    }));

    return newTransfers?.transfers ?? [];
  }, [accountRS, dispatch]);

  return (
    <div className="page-content">
      <SiteHeader pageTitle="Transfer History" />
      <div className="page-body container-fluid">
        <TableLoader
          headersList={[
            {
              name: 'Transaction',
              alignRight: false,
            }, {
              name: 'Currency',
              alignRight: false,
            }, {
              name: 'Date',
              alignRight: false,
            }, {
              name: 'Units',
              alignRight: true,
            }, {
              name: 'Recipient',
              alignRight: false,
            }, {
              name: 'Sender',
              alignRight: false,
            },
          ]}
          emptyMessage="No transfer history found."
          className="mb-3"
          TableRowComponent={TransferHistoryItem}
          dataLoaderCallback={getAssets}
        />
      </div>
    </div>
  );
}
