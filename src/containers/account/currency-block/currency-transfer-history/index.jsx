/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, {
  useEffect, useState, useCallback,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTransferHistory } from '../../../../actions/currencies';
import { BlockUpdater } from '../../../block-subscriber';
import SiteHeader from '../../../components/site-header';
import CustomTable from '../../../components/tables/table1';
import TransferHistoryItem from './transfer-history-item';

export default function TransferHistoryCurrency() {
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

  const listener = useCallback(data => {
    console.warn('height in dashboard', data);
    console.warn('updating dashboard');
    getAssets({
      firstIndex: pagination.firstIndex,
      lastIndex: pagination.lastIndex,
      page: pagination.page,
    });
  }, [getAssets, pagination.firstIndex, pagination.lastIndex, pagination.page,]);

  const onPaginate = useCallback(page => {
    const reqParams = {
      // !must be accont! don`t accRS
      page,
      firstIndex: page * 15 - 15,
      lastIndex: page * 15,
    };

    getAssets(reqParams);
  }, [getAssets]);

  useEffect(() => {
    getAssets({
      firstIndex: pagination.firstIndex,
      lastIndex: pagination.lastIndex,
      page: pagination.page,
    });
  }, []);

  useEffect(() => {
    BlockUpdater.on('data', data => listener(data));

    return () => BlockUpdater.removeAllListeners('data', listener);
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
          page={pagination.page}
          className="mb-3"
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
