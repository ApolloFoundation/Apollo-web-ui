/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, {
  useEffect, useCallback, useState,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAccountCurrenciesAction } from '../../../../actions/currencies';
import { BlockUpdater } from '../../../block-subscriber';
import CustomTable from '../../../components/tables/table1';
import SiteHeader from '../../../components/site-header';
import MyCurrencytemItem from './my-currency-item';

const itemsPerPage = 15;

export default function MyMadedCurrencies() {
  const dispatch = useDispatch();

  const { accountRS } = useSelector(state => state.account);

  const [executedExchanges, setExecutedExchanges] = useState(null);
  const [perPage, setPerPage] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    firstIndex: 0,
    lastIndex: 15,
  });

  const getExchanges = useCallback(async currPagination => {
    const exchanges = (await dispatch(getAccountCurrenciesAction({
      account: accountRS,
      ...currPagination,
    })));

    setPagination(currPagination);

    if (exchanges) {
      const accountCurrencies = exchanges.accountCurrencies
        .filter(el => el.code && el.name && el.type !== undefined);
      const count = accountCurrencies.length;
      setExecutedExchanges(accountCurrencies);
      setPerPage(exchanges.accountCurrencies.length === (itemsPerPage + 1)
        ? count - 1 : itemsPerPage);
    }
  }, [accountRS, dispatch]);

  const onPaginate = useCallback(currPage => {
    const newPagination = {
      page: currPage,
      firstIndex: currPage * itemsPerPage - itemsPerPage,
      lastIndex: currPage * itemsPerPage,
    };

    getExchanges(newPagination);
  }, [getExchanges]);

  const listener = useCallback(data => {
    console.warn('height in dashboard', data);
    console.warn('updating dashboard');
    getExchanges(pagination);
  }, [getExchanges, pagination]);

  useEffect(() => {
    getExchanges(pagination);
  }, []);

  useEffect(() => {
    BlockUpdater.on('data', data => listener(data));

    return () => BlockUpdater.removeAllListeners('data', listener);
  }, [listener]);

  return (
    <div className="page-content">
      <SiteHeader pageTitle="My currencies" />
      <div className="page-body container-fluid">
        <CustomTable
          header={[
            {
              name: 'Code',
              alignRight: false,
            }, {
              name: 'Name',
              alignRight: false,
            }, {
              name: 'Type',
              alignRight: false,
            }, {
              name: 'Units',
              alignRight: true,
            }, {
              name: 'Actions',
              alignRight: true,
            },
          ]}
          page={pagination.page}
          className="mb-3"
          TableRowComponent={MyCurrencytemItem}
          tableData={executedExchanges}
          isPaginate
          emptyMessage="No currencies found."
          previousHendler={() => onPaginate(pagination.page - 1)}
          nextHendler={() => onPaginate(pagination.page + 1)}
          itemsPerPage={perPage}
        />
      </div>
    </div>
  );
}
