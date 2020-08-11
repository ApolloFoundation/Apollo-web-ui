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

  const [page, setPage] = useState(1);
  const [firstIndex, setFirstIndex] = useState(0);
  const [lastIndex, setLastIndex] = useState(15);
  const [currencies, setCurrencies] = useState(null);

  const getCurrencie = useCallback(async reqParams => {
    const allCurrencies = await dispatch(getAllCurrenciesAction(reqParams));

    if (allCurrencies) {
      setCurrencies(allCurrencies.currencies);
      // ! there was setState({...reqParams})
    }
  }, []);

  const listener = useCallback(() => {
    getCurrencie({
      account,
      firstIndex,
      lastIndex,
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
    dispatch(getCurrencie({
      account,
      firstIndex,
      lastIndex,
    }));
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
          page={page}
          TableRowComponent={Currency}
          tableData={currencies}
          isPaginate
          previousHendler={() => onPaginate(page - 1)}
          nextHendler={() => onPaginate(page + 1)}
          emptyMessage="No currencies found."
          itemsPerPage={15}
        />
      </div>
    </div>
  );
}
