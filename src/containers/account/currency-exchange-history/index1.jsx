/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, {
  useCallback, useEffect, useState,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTradesHistoryAction } from '../../../actions/assets';
import { setBodyModalParamsAction } from '../../../modules/modals';
import { getTransactionAction } from '../../../actions/transactions';
import { getAccountExchangesAction } from '../../../actions/exchange-booth';
import { BlockUpdater } from '../../block-subscriber';
import SiteHeader from '../../components/site-header';
import CustomTable from '../../components/tables/table1';
import TradeHistoryItem from './exchange-history-item';

export default function TradeHistoryCurrency() {
  const dispatch = useDispatch();

  const { account, accountRS } = useSelector(state => state.account);

  const [executedExchanges, setExecutedExchanges] = useState(null);
  const [trades, setTrades] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    firstIndex: 0,
    lastIndex: 15,
  });

  const getExchanges = useCallback(async currency => {
    const exchanges = await dispatch(getAccountExchangesAction(currency));

    if (exchanges) {
      setExecutedExchanges(exchanges.exchanges);
    }
  });

  const onPaginate = useCallback(page => {
    const reqParams = {
      page,
      firstIndex: page * 15 - 15,
      lastIndex: page * 15,
    };

    setPagination(reqParams);

    // !unknown use func
    // this.setState(reqParams, () => {
    //     this.getAssets(reqParams)
    // });
  }, []);

  const getTradesHistory = useCallback(async requestParams => {
    const newTrades = await dispatch(getTradesHistoryAction(requestParams));

    if (newTrades) {
      setTrades(newTrades.trades);
    }
  }, []);

  const getTransaction = useCallback(async data => {
    const reqParams = {
      transaction: data,
      account,
    };

    const transaction = await dispatch(getTransactionAction(reqParams));

    if (transaction) {
      dispatch(setBodyModalParamsAction('INFO_TRANSACTION', transaction));
    }
  }, []);

  const listener = useCallback(data => {
    console.warn('height in dashboard', data);
    console.warn('updating dashboard');
    getTradesHistory({
      firstIndex: pagination.firstIndex,
      lastIndex: pagination.lastIndex,
      account: accountRS,
    });
  }, []);

  useEffect(() => {
    getTradesHistory({
      firstIndex: pagination.firstIndex,
      lastIndex: pagination.lastIndex,
      account: accountRS,
    });
    getExchanges({
      firstIndex: pagination.firstIndex,
      lastIndex: pagination.lastIndex,
      account: accountRS,
      includeCurrencyInfo: true,
    });
  }, []);

  useEffect(() => {
    BlockUpdater.on('data', data => listener(data));

    return () => BlockUpdater.removeAllListeners('data');
  }, []);

  return (
    <div className="page-content">
      <SiteHeader
        pageTitle="Exchange History"
      />
      <div className="page-body container-fluid">
        <CustomTable
          header={[
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
          TableRowComponent={el => (
            <TradeHistoryItem
              transfer={el}
            />
          )}
          tableData={executedExchanges}
          isPaginate
          page={pagination.page}
          previousHendler={() => onPaginate(pagination.page - 1)}
          nextHendler={() => onPaginate(pagination.page + 1)}
          className="mb-3"
          emptyMessage="No exchange history found."
          itemsPerPage={15}
        />
      </div>
    </div>
  );
}
