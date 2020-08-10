/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, {
  useState, useCallback, useEffect,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTradesHistoryAction } from '../../../actions/assets';
import { setBodyModalParamsAction } from '../../../modules/modals';
import { getTransactionAction } from '../../../actions/transactions';
import { BlockUpdater } from '../../block-subscriber';
import SiteHeader from '../../components/site-header';
import CustomTable from '../../components/tables/table';
import TradeHistoryItem from './trade-history-item';

export default function TradeHistory() {
  const dispatch = useDispatch();

  const { account, accountRS } = useSelector(state => state.account);

  const [trades, setTrades] = useState(null);
  const [page, setPage] = useState(1);
  const [firstIndex, setFirstIndex] = useState(0);
  const [lastIndex, setLastIndex] = useState(15);

  const getTradesHistory = useCallback(async requestParams => {
    const dataTrades = await dispatch(getTradesHistoryAction(requestParams));

    if (dataTrades) setTrades(dataTrades);
  }, [dispatch]);

  const getTransaction = useCallback(async data => {
    const reqParams = {
      transaction: data,
      account,
    };

    const transaction = await dispatch(getTransactionAction(reqParams));
    if (transaction) {
      dispatch(setBodyModalParamsAction('INFO_TRANSACTION', transaction));
    }
  }, [account, dispatch]);

  const onPaginate = useCallback(currPage => {
    // const reqParams = {
    //   currPage,
    //   account,
    //   firstIndex: currPage * 15 - 15,
    //   lastIndex: currPage * 15,
    // };

    setPage(currPage);
    setFirstIndex(currPage * 15 - 15);
    setLastIndex(currPage * 15);
    getTradesHistory({
      account: accountRS,
      firstIndex: currPage * 15 - 15,
      lastIndex: currPage * 15,
    });
  }, [accountRS, getTradesHistory]);

  useEffect(() => {
    getTradesHistory({
      account: accountRS,
      firstIndex,
      lastIndex,
    });
  }, []);

  useEffect(() => {
    getTradesHistory({
      firstIndex,
      lastIndex,
      account: accountRS,
    });
    BlockUpdater.on('data', data => {
      console.warn('height in dashboard', data);
      console.warn('updating dashboard');
      getTradesHistory({
        firstIndex,
        lastIndex,
        account: accountRS,
      });
    });

    return () => BlockUpdater.removeAllListeners('data');
  }, []);

  return (
    <div className="page-content">
      <SiteHeader
        pageTitle="Trade History"
      />
      <div className="page-body container-fluid">
        <CustomTable
          header={[
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
          TableRowComponent={el => (
            <TradeHistoryItem
              transfer={el}
              setTransaction={getTransaction}
            />
          )}
          isPaginate
          page={page}
          tableData={trades}
          previousHendler={() => onPaginate(page - 1)}
          nextHendler={() => onPaginate(page + 1)}
          itemsPerPage={15}
        />
      </div>
    </div>
  );
}
