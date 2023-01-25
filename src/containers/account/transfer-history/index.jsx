/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, {
  useEffect, useCallback, useState,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAccountInfoSelector } from '../../../selectors';
import { getTransferHistory } from '../../../actions/assets';
import { BlockUpdater } from '../../block-subscriber';
import SiteHeader from '../../components/site-header';
import CustomTable from '../../components/tables/table1';
import TransferHistoryItem from './transfer-history-item';

export default function ScheduledTransactions() {
  const dispatch = useDispatch();

  const { accountRS } = useSelector(getAccountInfoSelector);

  const [transfers, setTransfers] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    firstIndex: 0,
    lastIndex: 15,
  });

  const getAssets = useCallback(async () => {
    const newTransfers = await dispatch(getTransferHistory({ 
        account: accountRS,
        firstIndex: pagination.firstIndex,
        lastIndex: pagination.lastIndex
    }));

    if (newTransfers) {
      setTransfers(newTransfers.transfers);
    }
  }, [accountRS, pagination.firstIndex, pagination.lastIndex]);

  const onPaginate = useCallback(page => () => {
    setPagination({
      page,
      firstIndex: page * 15 - 15,
      lastIndex: page * 15,
    });
  }, [setPagination]);

  const listener = useCallback(() => getAssets(), [getAssets]);

  useEffect(() => {
    getAssets();
  }, [getAssets]);

  useEffect(() => {
    BlockUpdater.on('data', listener);
    return () => BlockUpdater.removeListener('data', listener);
  }, [listener]);

  return (
    <div className="page-content">
      <SiteHeader pageTitle="Transfer History" />
      <div className="page-body container-fluid">
        <CustomTable
          header={[
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
          page={pagination.page}
          TableRowComponent={TransferHistoryItem}
          tableData={transfers}
          isPaginate
          previousHendler={onPaginate(pagination.page - 1)}
          nextHendler={onPaginate(pagination.page + 1)}
          itemsPerPage={15}
        />
      </div>
    </div>
  );
}
