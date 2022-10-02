/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAccountSelector } from '../../../../selectors';
import { getAllCurrenciesAction } from '../../../../actions/currencies';
import SiteHeader from '../../../components/site-header';
import Currency from './currency';
import { TableLoader } from '../../../components/TableLoader';

export default function Currencies() {
  const dispatch = useDispatch();
  const account = useSelector(getAccountSelector);

  const getCurrencie = useCallback(async ({ firstIndex, lastIndex }) => {
    const allCurrencies = await dispatch(getAllCurrenciesAction({ account, firstIndex, lastIndex }));
    return allCurrencies?.currencies ?? [];
  }, [dispatch, account]);

  return (
    <div className="page-content">
      <SiteHeader pageTitle="Currencies" />
      <div className="page-body container-fluid">
        <TableLoader
          headersList={[
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
          TableRowComponent={Currency}
          emptyMessage="No currencies found."
          dataLoaderCallback={getCurrencie}
        />
      </div>
    </div>
  );
}
