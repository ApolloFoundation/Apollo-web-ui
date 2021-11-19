/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, {
  useEffect, useCallback, useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCurrenciesAction } from '../../../../actions/currencies';
import { BlockUpdater } from '../../../block-subscriber';
import SiteHeader from '../../../components/site-header';
import CustomTable from '../../../components/tables/table1';
import Currency from './currency';

export default function Currencies() {
  const dispatch = useDispatch();

  const { account } = useSelector(state => state.account);

  const [pagination, setPagination] = useState({
    page: 1,
    firstIndex: 0,
    lastIndex: 15,
  });

  const [dataCurrencies, setDataCurrencies] = useState(null);

  const getCurrencie = useCallback(async reqParams => {
    const allCurrencies = await dispatch(getAllCurrenciesAction({ account, ...reqParams }));
    if (allCurrencies) {
      const newPagination = { ...pagination, ...reqParams };
      setDataCurrencies(allCurrencies.currencies);
      setPagination(newPagination);
    }
  }, [dispatch]);

  const listener = useCallback(() => {
    getCurrencie({
      page: pagination.page,
      firstIndex: pagination.firstIndex,
      lastIndex: pagination.lastIndex,
    });
  }, [getCurrencie, pagination.firstIndex, pagination.lastIndex]);

  const onPaginate = useCallback(currPage => {
    getCurrencie({
      page: currPage,
      firstIndex: currPage * 15 - 15,
      lastIndex: currPage * 15,
    });
  }, [getCurrencie]);

  useEffect(() => {
    getCurrencie({
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
      <SiteHeader pageTitle="Currencies" />
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
          tableData={dataCurrencies}
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
