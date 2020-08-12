/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, {
  useEffect, useCallback, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCurrenciesAction } from '../../../actions/currencies';
import { BlockUpdater } from '../../block-subscriber';
import SiteHeader from '../../components/site-header';
import Currency from './currency';

import CustomTable from '../../components/tables/table';

export default function Currencies() {
  const dispatch = useDispatch();

  const { account } = useSelector(state => state.account);

  const [pagination, setPagination] = useState({
    page: 1,
    firstIndex: 0,
    lastIndex: 15,
  });

  const [currencies, setCurrencies] = useState(null);

  const getCurrencie = useCallback(async reqParams => {
    const allCurrencies = await dispatch(getAllCurrenciesAction(reqParams));

    if (allCurrencies) {
      setCurrencies(allCurrencies.currencies);
      setPagination({ ...pagination, ...reqParams });
    }
  }, []);

  const listener = useCallback(() => {
    getCurrencie({
      account,
      firstIndex: pagination.firstIndex,
      lastIndex: pagination.lastIndex,
    });
  }, []);

  const onPaginate = useCallback(currPage => {
    getCurrencie({
      page: currPage,
      account,
      firstIndex: currPage * 15 - 15,
      lastIndex: currPage * 15,
    });
  }, []);

  useEffect(() => {
    getCurrencie({
      account,
      firstIndex: pagination.firstIndex,
      lastIndex: pagination.lastIndex,
    });
  }, []);

  useEffect(() => {
    BlockUpdater.on('data', listener);

    return () => BlockUpdater.removeListener('data', listener);
  }, [listener]);

  return (
    <div className="page-content">
      <SiteHeader
        pageTitle="Currencies"
      />
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
              name: 'Current Supply',
              alignRight: true,
            }, {
              name: 'Max Supply',
              alignRight: true,
            }, {
              name: 'Actions',
              alignRight: true,
            },
          ]}
          className="mb-3"
          page={pagination.page}
          TableRowComponent={Currency}
          tableData={currencies}
          isPaginate
          previousHendler={() => onPaginate(pagination.page - 1)}
          nextHendler={() => onPaginate(pagination.page + 1)}
          emptyMessage="No currencies found."
          itemsPerPage={15}
        />
      </div>
    </div>
  );
}
