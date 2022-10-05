/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAccountInfoSelector } from '../../../selectors';
import { getTransferHistory } from '../../../actions/assets';
import SiteHeader from '../../components/site-header';
import { TableLoader } from '../../components/TableLoader';
import TransferHistoryItem from './transfer-history-item';

export default function TransferHistory() {
  const dispatch = useDispatch();
  const { accountRS } = useSelector(getAccountInfoSelector);

  const getAssets = useCallback(async ({ firstIndex, lastIndex }) => {
    const newTransfers = await dispatch(getTransferHistory({ 
        account: accountRS,
        firstIndex,
        lastIndex,
    }));

    return newTransfers?.transfers ?? [];
  }, [dispatch, accountRS]);

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
              name: 'Asset',
              alignRight: false,
            }, {
              name: 'Date',
              alignRight: false,
            }, {
              name: 'Quantity',
              alignRight: true,
            }, {
              name: 'Recipient',
              alignRight: false,
            }, {
              name: 'Sender',
              alignRight: false,
            },
          ]}
          emptyMessage="No asset transfer history available."
          className="mb-3"
          TableRowComponent={TransferHistoryItem}
          dataLoaderCallback={getAssets}
        />
      </div>
    </div>
  );
}
