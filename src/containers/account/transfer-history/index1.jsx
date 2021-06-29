/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, {
  useEffect, useCallback, useState,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTransferHistory } from '../../../actions/assets';
import { BlockUpdater } from '../../block-subscriber';
import SiteHeader from '../../components/site-header';
import CustomTable from '../../components/tables/table1';
import TransferHistoryItem from './transfer-history-item/index1';

export default function ScheduledTransactions() {
  const dispatch = useDispatch();

  const { accountRS } = useSelector(state => state.account);

  const [transfers, setTransfers] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    firstIndex: 0,
    lastIndex: 15,
  });

  const getAssets = useCallback(async requestParams => {
    const newTransfers = await dispatch(getTransferHistory(
      { account: accountRS, ...requestParams },
    ));

    setPagination(requestParams);

    if (newTransfers) {
      setTransfers(newTransfers.transfers);
    }
  }, [accountRS, dispatch]);

  const onPaginate = useCallback(page => {
    const reqParams = {
      // !must be accont! don`t accRS
      page,
      firstIndex: page * 15 - 15,
      lastIndex: page * 15,
    };

    getAssets(reqParams);
  }, [getAssets]);

  const listener = useCallback(data => {
    console.warn('height in dashboard', data);
    console.warn('updating dashboard');
    getAssets({
      firstIndex: pagination.firstIndex,
      lastIndex: pagination.lastIndex,
    });
  }, [getAssets, pagination.firstIndex, pagination.lastIndex]);

  useEffect(() => {
    getAssets({
      firstIndex: pagination.firstIndex,
      lastIndex: pagination.lastIndex,
    });
  }, []);

  useEffect(() => {
    BlockUpdater.on('data', data => listener(data));

    return () => BlockUpdater.removeAllListeners('data', listener);
  }, [listener]);

  console.log(333)

  return (
    <div className="page-content">
      <SiteHeader pageTitle="Transfer History1" />
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
          previousHendler={() => onPaginate(pagination.page - 1)}
          nextHendler={() => onPaginate(pagination.page + 1)}
          itemsPerPage={15}
        />
      </div>
    </div>
  );
}
