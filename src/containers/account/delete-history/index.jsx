/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/

import React, { useCallback } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getDeleteHistory } from "../../../actions/delete-history";
import { DeleteItem } from "./deletes/index";
import SiteHeader from '../../components/site-header'
import { TableLoader } from '../../components/TableLoader';
import { getAccountRsSelector } from '../../../selectors';

const headersList = [
  {
    name: 'Transaction',
    alignRight: false
  }, 
  {
    name: 'Asset',
    alignRight: false
  },
  {
    name: 'Date',
    alignRight: false
  },
  {
    name: 'Quantity',
    alignRight: true
  }
];

export const DeleteHistory = () => {
  const dispatch = useDispatch();
  const accountRs = useSelector(getAccountRsSelector);

  const getDeleteHistoryCallback = useCallback(({ firstIndex, lastIndex }) => 
    dispatch(getDeleteHistory(accountRs, firstIndex, lastIndex))
      .then(history => history.deletes)
  , [accountRs, dispatch]);

  return (
    <div className="page-content">
      <SiteHeader pageTitle='Delete History' />
        <div className="page-body container-fluid">
          <TableLoader
            headersList={headersList}
            className='mb-3'
            TableRowComponent={DeleteItem}
            emptyMessage='No asset deletion history available.'
            dataLoaderCallback={getDeleteHistoryCallback}
          />
        </div>
    </div>
  )
} 

export default DeleteHistory
 